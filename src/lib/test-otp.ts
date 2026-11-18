import 'server-only';
import { apiGet } from './api';

/**
 * True while the API has a test code (TEST_OTP) switched on. Steps that wait for an
 * emailed link then also show a box for the code. Off if the API cannot be reached.
 */
export async function testOtpEnabled(): Promise<boolean> {
  try {
    return (await apiGet<{ enabled: boolean }>('/v1/test-otp')).enabled === true;
  } catch {
    return false;
  }
}
