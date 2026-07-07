// photobooth-template-studio/scripts/glm5.js
import { callPartnerModel } from '../lib/genaiPartner.js';

const prompt = process.argv.slice(2).join(' ');

if (!prompt) {
  console.log('Usage: node scripts/glm5.js "your prompt here"');
  process.exit(1);
}

(async () => {
  try {
    const response = await callPartnerModel(prompt);
    console.log(response);
  } catch (e) {
    console.error('Error calling GLM-5:', e.message);
    process.exit(1);
  }
})();
