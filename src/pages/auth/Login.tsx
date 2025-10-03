import { Icon } from "@iconify/react";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import backgroundImg from "@/images/background.jpg";
import ufpsLogoImg from "@/images/ufps-logo.png";
import { auth } from "@/lib/firebase";

export default function Login() {
  async function handleLogin() {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMapping = new Map();

        errorMapping.set(
          "auth/too-many-requests",
          "Demasiadas peticiones. Inténtalo más tarde.",
        );

        errorMapping.set(
          "auth/cancelled-popup-request",
          "Se ha cancelado el inicio de sesión.",
        );

        toast.error(errorMapping.get(error.code) || error.code);
      }

      console.error(error);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <img
        src={backgroundImg}
        className="absolute top-0 left-0 h-screen w-screen object-cover"
      />
      <div className="absolute top-0 left-0 h-screen w-screen bg-primary/33"></div>
      <Card className="relative w-72">
        <CardHeader className="flex flex-col items-center">
          <img src={ufpsLogoImg} alt="UFPS Logo" className="w-64" />
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            variant="secondary"
            className="font-bold"
            onClick={handleLogin}
          >
            <Icon icon="devicon:google" />
            Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
