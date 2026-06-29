import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authService } from '../services/authService';

const resetPasswordSchema = z
  .object({
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
    otp: z.string().trim().length(6, 'Mã OTP phải gồm 6 chữ số'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const initialEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('newPassword');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data.email, data.otp, data.newPassword);
      toast.success('Mật khẩu đã được đặt lại. Chuyển đến trang đăng nhập...');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:hidden flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">EduPath</h1>
      </div>

      <div className="max-w-lg mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Đặt lại mật khẩu</h2>
        <p className="text-slate-500 mb-8">
          Nhập email, mã OTP và mật khẩu mới để hoàn tất quá trình đặt lại. Mã OTP được gửi vào email sau khi bạn nhấn gửi ở trang trước.
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

          <Input
            label="Mã OTP (6 chữ số)"
            type="text"
            placeholder="123456"
            error={errors.otp?.message}
            {...register('otp')}
          />

          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Đặt lại mật khẩu
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Đã nhớ mật khẩu?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
