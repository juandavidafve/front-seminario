import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import backgroundImg from "@/images/background.jpg";
import ufpsLogoImg from "@/images/ufps-logo.png";

export default function Login() {
  function login() {
    alert("AA");
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
          <Button variant="secondary" className="font-bold" onClick={login}>
            <Icon icon="devicon:google" />
            Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
