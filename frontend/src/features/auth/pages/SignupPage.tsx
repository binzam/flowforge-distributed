import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useSignUpUser } from "../hooks/auth-hook";
import {
  signUpFormSchema,
  type SignUpFormValues,
} from "../schemas/auth-schema";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: signUp, isPending, error: apiError } = useSignUpUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    signUp(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8 selection:bg-white selection:text-black">
      <div className="w-full max-w-md space-y-10">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xl font-bold tracking-tighter text-white inline-block mb-8"
          >
            FLOWFORGE.
          </Link>
          <h2 className="text-4xl font-bold tracking-tighter text-white uppercase">
            Register
          </h2>
          <p className="mt-3 text-sm tracking-wide text-neutral-400">
            Join the studio to start collecting.
          </p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="p-4 bg-neutral-900 border border-red-900/50 text-red-500 text-xs font-medium tracking-widest uppercase text-center">
            {apiError.message || "Failed to create account."}
          </div>
        )}

        {/* Form */}
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
              className={`block w-full bg-neutral-900/50 border p-4 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                errors.name
                  ? "border-red-900 focus:border-red-500"
                  : "border-neutral-800 focus:border-white focus:bg-neutral-900"
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className={`block w-full bg-neutral-900/50 border p-4 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-900 focus:border-red-500"
                  : "border-neutral-800 focus:border-white focus:bg-neutral-900"
              }`}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("password")}
                className={`block w-full bg-neutral-900/50 border p-4 pr-12 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-900 focus:border-red-500"
                    : "border-neutral-800 focus:border-white focus:bg-neutral-900"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={`block w-full bg-neutral-900/50 border p-4 pr-12 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-900 focus:border-red-500"
                    : "border-neutral-800 focus:border-white focus:bg-neutral-900"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group w-full flex items-center justify-center gap-3 bg-white py-4 mt-4 text-xs font-bold tracking-[0.2em] text-black uppercase hover:bg-neutral-200 active:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 pt-8 border-t border-neutral-800">
          <p className="text-xs tracking-wide text-neutral-500">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-white hover:text-neutral-300 underline underline-offset-4 decoration-neutral-700 hover:decoration-neutral-300 transition-all"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
