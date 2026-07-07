// testPartner.js
import { callPartnerModel } from './lib/genaiPartner.js';
(async () => {
  try {
    const resp = await callPartnerModel('Explain GLM-5 capabilities in two sentences.');
    console.log('Response:', resp);
  } catch (e) {
    console.error('Error:', e);
  }
})();
