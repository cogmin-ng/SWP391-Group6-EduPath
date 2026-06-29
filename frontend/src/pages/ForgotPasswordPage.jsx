import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authService } from '../services/authService';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      toast.success('Nếu email tồn tại, mã reset đã được gửi. Vui lòng kiểm tra hộp thư.');
      navigate('/reset-password', { state: { email: data.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gửi mã thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const sideContent = (
    <>
      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
        <div className="w-3 h-3 rounded-sm bg-white/80" />
      </div>

      <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
        Quên mật khẩu?
      </h2>
      <p className="text-white/70 text-lg leading-relaxed">
        Nhập email của bạn để nhận mã đặt lại mật khẩu. Mã sẽ được gửi ngay vào hộp thư.
      </p>
    </>
  );

  return (
    <AuthLayout side={sideContent}>
      <div className="lg:hidden flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">EduPath</h1>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quên mật khẩu</h2>
        <p className="text-slate-500 mb-8">
          Nhập email đã đăng ký và chúng tôi sẽ gửi mã OTP để bạn đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="ten.ho@example.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Gửi mã đặt lại
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Đã nhớ mật khẩu?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
