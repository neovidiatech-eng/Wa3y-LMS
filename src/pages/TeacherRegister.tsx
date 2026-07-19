import { Controller, useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { TeacherRegisterInput, TeacherRegisterSchema } from "../lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COUNTRIES } from "../consts";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { DatePicker, Input, Select } from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";


interface TeacherRegisterProps {
    onRegisterSuccess: () => void;
}

export default function TeacherRegister() {
    const { t, language } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit: handleFormSubmit,
        control,
        formState: { errors },
    } = useForm<TeacherRegisterInput>({
        resolver: zodResolver(TeacherRegisterSchema(t)),
        mode: "onChange",
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            codeCountry: "+20",
            birth_date: "",
            gender: "",
            country: "",
            nationality: "",
            password: "",
        },
    });

    const onSubmit = async (data: TeacherRegisterInput) => {
        console.log(data);
    };

    const genders = [
        { value: "male", label: t("male") },
        { value: "female", label: t("female") },
    ];

    const displayNames = new Intl.DisplayNames(
        [language === "ar" ? "ar" : "en"],
        { type: "region" }
    );

    const countries = DEFAULT_COUNTRIES.map((country) => ({
        value: country.name,
        label: `${country.emoji} ${displayNames.of(country.iso2) || country.name}`,
    }));

    const nationalityOptions = DEFAULT_COUNTRIES.map((country) => ({
        value: country.nationality,
        label: country.nationality,
    }));

    const countryCodes = Array.from(
        new Map(
            DEFAULT_COUNTRIES.map((country) => [
                `+${country.phone_code}`,
                {
                    value: `+${country.phone_code}`,
                    label: `${country.emoji} ${displayNames.of(country.iso2) || country.name
                        } (+${country.phone_code})`,
                    country: displayNames.of(country.iso2) || country.name,
                },
            ])
        ).values()
    );
    

    return (
<div className="w-full">
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {t("registerNewTeacher")}
          </h1>
          <p className="text-slate-500 text-sm font-medium">{t("joinAcademyTeacher")}</p>
        </div>

        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="text-start">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("fullName")} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("name")}
                  placeholder={language === "ar" ? "أحمد محمد" : "Ahmed Mohamed"}
                  className={`w-full h-12 px-4 py-2.5 ${language === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} bg-slate-50 border ${errors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} rounded-xl outline-none transition-all focus:ring-4 hover:border-slate-300 font-medium`}
                />
                <div className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`}>
                  <User className="w-5 h-5" />
                </div>
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="text-start">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("email")} *
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="teacher@example.com"
                  className={`w-full h-12 px-4 py-2.5 ${language === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} rounded-xl outline-none transition-all focus:ring-4 hover:border-slate-300 font-medium`}
                  dir="ltr"
                />
                <div className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`}>
                  <Mail className="w-5 h-5" />
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Phone and Country Code */}
            <div className="text-start">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("phoneNumber")} *
              </label>
              <div className="flex gap-2" dir="ltr">
                <Controller
                  name="codeCountry"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countryCodes}
                      className="h-12 text-slate-600 font-medium"
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      placeholder="01069441989"
                      status={errors.phone ? "error" : ""}
                      className="flex-1 h-12 bg-slate-50 border-slate-200 rounded-xl font-medium focus:bg-white"
                    />
                  )}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-semibold text-start">{errors.phone.message}</p>}
            </div>

            {/* Birth Date */}
            <div className="text-start">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("birthDate")} *
              </label>
              <Controller
                name="birth_date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:shadow-none h-12 w-full text-slate-600 font-medium hover:border-slate-300"
                    status={errors.birth_date ? "error" : ""}
                    placeholder={t("selectDate")}
                    value={value ? dayjs(value) : null}
                    onChange={(date: Dayjs | null) => onChange(date ? date.format("YYYY-MM-DD") : "")}
                  />
                )}
              />
              {errors.birth_date && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.birth_date.message}</p>}
            </div>

            {/* Gender */}
            <div className="text-start">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("gender")} *
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={t("selectGender")}
                    options={genders}
                    className="w-full h-12"
                    status={errors.gender ? "error" : ""}
                    placement={language === "ar" ? "bottomRight" : "bottomLeft"}
                  />
                )}
              />
              {errors.gender && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.gender.message}</p>}
            </div>

            {/* Country */}
            <div className="text-start">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("country")} *
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder={t("selectCountry")}
                    options={countries}
                    className="w-full h-12"
                    status={errors.country ? "error" : ""}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )}
              />
            {errors.country && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.country.message}</p>}
          </div>

          {/* Nationality */}
          <div className="text-start">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("nationality")} *
            </label>
            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder={t("selectNationality")}
                  options={nationalityOptions}
                  className="w-full h-12"
                  status={errors.nationality ? "error" : ""}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />
              )}
            />
            {errors.nationality && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.nationality.message}</p>}
          </div>

          {/* Password */}
          <div className="text-start md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("password")} *
            </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full h-12 px-4 py-2.5 ${language === 'ar' ? 'pr-11 pl-11' : 'pl-11 pr-11'} bg-slate-50 border ${errors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} rounded-xl outline-none transition-all focus:ring-4 hover:border-slate-300 font-medium`}
                  dir="ltr"
                />
                <div className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`}>
                  <Lock className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${language === "ar" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.password.message}</p>}
            </div>
          </div>
        </form>
      </div>
    )
}