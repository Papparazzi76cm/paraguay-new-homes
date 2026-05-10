import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-2xl py-20 text-center">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">¡Pago confirmado!</h1>
        <p className="text-muted-foreground mb-2">
          Tu suscripción se activó correctamente. Ya podés acceder al panel de desarrollador.
        </p>
        {sessionId && (
          <p className="text-xs text-muted-foreground mb-8">Sesión: {sessionId}</p>
        )}
        <Link
          to="/developer"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Ir al panel
        </Link>
      </main>
      <Footer />
    </div>
  );
}