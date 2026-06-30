import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginAs() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 p-6">
      <h1 className="text-4xl font-semibold">Who are you?</h1>

      <div className="flex flex-col gap-6 sm:flex-row">
        <Link to="/login/client">
          <Card className="h-[130px] w-[200px] transition-transform hover:scale-105">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-blue-600">Client</CardTitle>
              <CardDescription>Post requests and get quotes</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </Link>

        <Link to="/login/transporter">
          <Card className="h-[130px] w-[200px] transition-transform hover:scale-105">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-primary">Transporter</CardTitle>
              <CardDescription>View client requests and quote prices</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default LoginAs;
