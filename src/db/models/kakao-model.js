import { model } from 'mongoose';
import { KakaoSchema } from '../schemas/kakao-schema';
const KakaoUser = model('kakao-users', KakaoSchema);
export { KakaoUser };
