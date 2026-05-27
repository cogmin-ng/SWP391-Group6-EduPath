import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, User } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Vui lòng nhập họ và tên'),
    email: z
      .string()
      .min(1, 'Vui lòng nhập email')
      .email('Email không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Bạn phải đồng ý với điều khoản' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { level: score, label: 'Yếu', color: 'bg-red-500' };
  if (score <= 3) return { level: score, label: 'Trung bình', color: 'bg-amber-500' };
  return { level: score, label: 'Mạnh', color: 'bg-green-500' };
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const passwordValue = watch('password');
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login', { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const sideContent = (
    <>
      {/* Decorative icon */}
      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
        <div className="w-3 h-3 rounded-sm bg-white/80" />
      </div>

      <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
        Gia tốc hành trình học tập.
      </h2>
      <p className="text-white/70 text-lg leading-relaxed">
        Kết nối với các chuyên gia, xây dựng lộ trình cá nhân hóa và đạt được
        mục tiêu nghề nghiệp của bạn nhanh hơn với EduPath.
      </p>
    </>
  );

  return (
    <AuthLayout side={sideContent}>
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">EduPath</h1>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Tạo tài khoản</h2>
        <p className="text-slate-500 mb-8">
          Bắt đầu hành trình của bạn với EduPath ngay hôm nay.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Họ và tên"
            type="text"
            placeholder="Nguyễn Văn A"
            icon={User}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />
            {/* Password Strength */}
            {passwordValue && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i <= strength.level ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Độ mạnh: <span className="font-medium">{strength.label}</span>
                </p>
              </div>
            )}
            {!errors.password && (
              <p className="text-xs text-slate-400 mt-1">
                Mật khẩu phải có ít nhất 8 ký tự.
              </p>
            )}
          </div>

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                {...register('terms')}
              />
              <span className="text-sm text-slate-600 leading-snug">
                Tôi đồng ý với{' '}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Chính sách bảo mật
                </a>{' '}
                của EduPath.
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 text-xs text-red-500">{errors.terms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Đăng ký tài khoản
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
