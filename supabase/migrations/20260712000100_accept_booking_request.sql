-- R1 — transactional accept, first-accepted-wins. A plpgsql function body
-- is a single transaction; the WHERE status='open' guard is the race lock:
-- concurrent callers serialize on the availability row lock, and the loser
-- sees zero rows updated.

create or replace function public.accept_booking_request(
  p_request_id uuid,
  p_decided_by text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req public.booking_requests%rowtype;
  v_slot_rows integer;
  v_declined uuid[];
  v_winner text;
begin
  select * into v_req from public.booking_requests where id = p_request_id;
  if not found then
    return jsonb_build_object('outcome', 'request_not_actionable');
  end if;

  -- Guard 1: the slot. Zero rows = another accept already won.
  update public.availability
     set status = 'booked'
   where date = v_req.date and slot = v_req.slot and status = 'open';
  get diagnostics v_slot_rows = row_count;

  if v_slot_rows = 0 then
    select decided_by into v_winner
      from public.booking_requests
     where date = v_req.date and slot = v_req.slot and status = 'accepted'
     order by decided_at desc limit 1;
    return jsonb_build_object('outcome', 'slot_taken', 'decided_by', coalesce(v_winner, 'unknown'));
  end if;

  -- Guard 2: the request itself (same pattern — status must still be live).
  update public.booking_requests
     set status = 'accepted', decided_by = p_decided_by, decided_at = now()
   where id = p_request_id and status in ('pending','held');
  if not found then
    -- Roll the slot flip back by raising: plpgsql aborts the whole function tx.
    raise exception 'request % not in an actionable state', p_request_id
      using errcode = 'P0001';
  end if;

  -- Competing pending/held requests on the same (date,slot) flip to declined
  -- in the SAME transaction (spec R1). Alternates email is the caller's job.
  -- (CTE, not UPDATE..RETURNING INTO — that form can't collect multiple rows.)
  with declined as (
    update public.booking_requests
       set status = 'declined', decided_by = p_decided_by, decided_at = now()
     where date = v_req.date and slot = v_req.slot
       and id <> p_request_id
       and status in ('pending','held')
    returning id
  )
  select coalesce(array_agg(id), '{}') into v_declined from declined;

  return jsonb_build_object(
    'outcome', 'accepted',
    'request_id', p_request_id,
    'declined_ids', to_jsonb(v_declined)
  );
end;
$$;

revoke all on function public.accept_booking_request(uuid, text) from public, anon, authenticated;
