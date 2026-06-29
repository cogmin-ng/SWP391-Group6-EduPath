const resendClient = require('../../../lib/resend');
const config = require('../../../config');

const DEFAULT_EXPIRE_MINUTES = 10;

const buildOtpHtml = ({ otp, expiresInMinutes, purpose }) => {
  const title = purpose === 'RESET_PASSWORD' ? 'Đặt lại mật khẩu EduPath' : 'Xác thực tài khoản EduPath';
  const intro =
    purpose === 'RESET_PASSWORD'
      ? 'Sử dụng mã bên dưới để đặt lại mật khẩu của bạn. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.'
      : 'Sử dụng mã bên dưới để hoàn tất xác thực tài khoản của bạn.';
  const buttonText = purpose === 'RESET_PASSWORD' ? 'Đặt lại mật khẩu' : 'Xác thực tài khoản';

  return `
    <div style="font-family:Inter, Arial, Helvetica, sans-serif; background:#f3f4f6; padding:24px;">
      <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:24px;padding:28px;box-shadow:0 20px 80px rgba(15,23,42,0.08);border:1px solid rgba(148,163,184,0.16);">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
          <div style="width:50px;height:50px;border-radius:16px;background:#4f46e5;display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;font-size:20px;letter-spacing:1px;">EP</div>
          <div>
            <p style="margin:0;font-size:14px;color:#4338ca;text-transform:uppercase;letter-spacing:1px;font-weight:700;">EduPath</p>
            <h1 style="margin:6px 0 0;font-size:24px;color:#0f172a;line-height:1.2;">${title}</h1>
          </div>
        </div>
        <p style="margin:0 0 26px;color:#475569;font-size:15px;line-height:1.7;">${intro} Mã này còn hiệu lực trong ${expiresInMinutes} phút.</p>
        <div style="background:#eef2ff;border:1px dashed #c7d2fe;border-radius:18px;padding:22px 0;text-align:center;">
          <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:6px;color:#312e81;">${otp}</p>
        </div>
        <div style="margin-top:24px;padding:20px;background:#f8fafc;border-radius:18px;border:1px solid #e2e8f0;">
          <p style="margin:0;color:#475569;font-size:14px;line-height:1.8;"><strong>Lưu ý:</strong> Không chia sẻ mã này với bất kỳ ai. Nếu bạn không yêu cầu mã, hãy bỏ qua email này.</p>
        </div>
        <div style="margin-top:28px;text-align:center;color:#94a3b8;font-size:12px;">© EduPath. Giữ an toàn và tiếp tục tiến bước.</div>
      </div>
    </div>
  `;
};

const buildOtpText = ({ otp, expiresInMinutes, purpose }) => {
  const action = purpose === 'RESET_PASSWORD' ? 'đặt lại mật khẩu' : 'xác thực tài khoản';
  return `Mã EduPath của bạn là ${otp}. Sử dụng mã này để ${action}. Mã có hiệu lực trong ${expiresInMinutes} phút.`;
};

exports.sendOtpEmail = async ({ email, otp, expiresInMinutes = DEFAULT_EXPIRE_MINUTES, purpose = 'VERIFY_EMAIL' }) => {
  const subject =
    purpose === 'RESET_PASSWORD'
      ? 'Mã đặt lại mật khẩu EduPath'
      : 'Mã xác thực EduPath của bạn';
  const payload = {
    from: config.resend.fromEmail,
    to: email,
    subject,
    html: buildOtpHtml({ otp, expiresInMinutes, purpose }),
    text: buildOtpText({ otp, expiresInMinutes, purpose }),
  };

  return resendClient.sendMail(payload);
};
// Only OTP emails are used in this project. Link verification removed.
