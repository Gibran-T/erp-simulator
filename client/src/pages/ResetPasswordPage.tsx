/**
 * ResetPasswordPage — Set a new password using a reset token
 * Public page: no auth required
 * Route: /reset-password/:token
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, KeyRound, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const newPassword = watch("newPassword");

  const resetPassword = trpc.auth.resetPasswordWithToken.useMutation({
    onSuccess: () => {
      setSuccess(true);
      toast.success("Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/login"), 3000);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de la réinitialisation.");
    },
  });

  const onSubmit = (data: FormData) => {
    if (!token) {
      toast.error("Token manquant. Veuillez utiliser le lien complet.");
      return;
    }
    resetPassword.mutate({ token, newPassword: data.newPassword });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Lien invalide</h1>
          <p className="text-muted-foreground text-sm">Ce lien de réinitialisation est invalide ou incomplet.</p>
          <a href="/forgot-password" className="mt-4 inline-block text-sm text-primary hover:underline">
            Demander un nouveau lien
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            Nouveau mot de passe
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Choisissez un nouveau mot de passe sécurisé.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {success ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <p className="font-semibold text-foreground">Mot de passe mis à jour !</p>
              <p className="text-sm text-muted-foreground">Redirection vers la connexion dans 3 secondes...</p>
              <a href="/login" className="inline-block text-sm text-primary hover:underline">
                Se connecter maintenant →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 caractères"
                    className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    {...register("newPassword", {
                      required: "Le mot de passe est requis",
                      minLength: { value: 6, message: "Minimum 6 caractères" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-destructive text-xs mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Répétez le mot de passe"
                    className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    {...register("confirmPassword", {
                      required: "Veuillez confirmer le mot de passe",
                      validate: (value) => value === newPassword || "Les mots de passe ne correspondent pas",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetPassword.isPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resetPassword.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Réinitialisation...</>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}
