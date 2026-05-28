import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, Sparkles, Route } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { getDashboardByRole } from '../context/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success('Đăng nhập thành công!');
      
      const redirectPath = getDashboardByRole(user?.roles || []);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const sideContent = (
    <>
      <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
        Chào mừng bạn trở lại.
      </h2>
      <p className="text-white/70 text-lg leading-relaxed mb-8">
        Tiếp tục hành trình học tập của bạn. Kết nối với mentor, theo dõi lộ
        trình và chinh phục những mục tiêu mới ngay hôm nay.
      </p>
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4" />
          Mentor Hàng Đầu
        </div>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full">
          <Route className="w-4 h-4" />
          Lộ Trình Tối Ưu
        </div>
      </div>
    </>
  );

  return (
    <AuthLayout side={sideContent}>
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">EduPath</h1>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Đăng nhập</h2>
        <p className="text-slate-500 mb-8">
          Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
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
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
