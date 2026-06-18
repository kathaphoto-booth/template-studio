-- Create rate limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    key text PRIMARY KEY,
    tokens integer NOT NULL,
    last_refill timestamp with time zone NOT NULL
);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- rate_limits is service_role access only (no anon select/insert policies)

-- Create rate limit checker function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_interval_seconds integer
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_now timestamp with time zone := now();
  v_tokens integer;
  v_last_refill timestamp with time zone;
  v_reset timestamp with time zone;
  v_remaining integer;
  v_success boolean;
BEGIN
  -- Select and lock the row for the given key to prevent race conditions
  SELECT tokens, last_refill 
  INTO v_tokens, v_last_refill
  FROM public.rate_limits
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    -- First request for this key
    INSERT INTO public.rate_limits (key, tokens, last_refill)
    VALUES (p_key, p_limit - 1, v_now);
    v_remaining := p_limit - 1;
    v_success := true;
    v_reset := v_now + (p_interval_seconds * interval '1 second');
  ELSE
    -- Refill tokens based on elapsed time since last request
    DECLARE
      v_elapsed numeric := extract(epoch from (v_now - v_last_refill));
      v_refill_tokens integer := floor((v_elapsed / p_interval_seconds) * p_limit)::integer;
    BEGIN
      IF v_elapsed >= p_interval_seconds THEN
        v_tokens := p_limit;
        v_last_refill := v_now;
      ELSIF v_refill_tokens > 0 THEN
        v_tokens := least(p_limit, v_tokens + v_refill_tokens);
        -- Advance last_refill timestamp proportionally
        v_last_refill := v_last_refill + (v_refill_tokens::numeric / p_limit * p_interval_seconds) * interval '1 second';
      END IF;
    END;

    IF v_tokens >= 1 THEN
      v_tokens := v_tokens - 1;
      v_success := true;
    ELSE
      v_success := false;
    END IF;

    UPDATE public.rate_limits
    SET tokens = v_tokens, last_refill = v_last_refill
    WHERE key = p_key;

    v_remaining := v_tokens;
    v_reset := v_last_refill + (p_interval_seconds * interval '1 second');
  END IF;

  RETURN jsonb_build_object(
    'success', v_success,
    'remaining', v_remaining,
    'reset', to_char(v_reset, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  );
END;
$$;
