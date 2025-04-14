import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { io } from "socket.io-client";
import { toast } from "sonner";

interface UsdtDataResponse {
  lastUpdate: string;
  currentValidLink: "coinBaseData" | "investingData" | "currencyDataFeedData";
  coinBaseData: {
    usdtSpot: number;
    usdt: number;
  };
  investingData: {
    usdtSpot: number;
    usdt: number;
  };
  currencyDataFeedData: {
    usdtSpot: number;
    usdt: number;
  };
}

export function Quotes() {
  const [usdt, setUsdt] = useState<UsdtDataResponse | null>(null);
  const [searchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();

  const spread = searchParams.get("spread")
    ? parseFloat(searchParams.get("spread") as string)
    : null;

  useEffect(() => {
    console.log("Spread:", spread);
    const socket = io("http://localhost:3333", {
      transports: ["websocket"],
    });

    socket.emit("update");

    socket.on("connect", () => {
      console.log("Connected to WebSocket via Socket.IO");
    });

    socket.on("update", (data: UsdtDataResponse) => {
      console.log("Received data:", JSON.stringify(data));
      console.log("Type of data:", typeof data);
      setUsdt(data);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket connection closed");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      toast.error("Erro ao conectar com a API.", {
        position: "top-right",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background">
      <Button
        className="absolute top-4 right-4"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
      <Card className="w-2/5 bg-background">
        <CardHeader className="text-center">
          <CardTitle>Cotação USDT/SPOT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-stone-300 text-secondary-foreground dark:text-primary-foreground rounded-xl">
            {usdt ? (
              <p>
                USD SPOT: R$ {usdt?.[usdt.currentValidLink].usdtSpot.toFixed(4)}
              </p>
            ) : (
              "Carregando.."
            )}
          </div>
          <div className="p-4 bg-stone-300 text-secondary-foreground dark:text-primary-foreground rounded-xl font-bold">
            {!!usdt && !!spread ? (
              <p>
                USD SPOT: R${" "}
                {(
                  usdt?.[usdt.currentValidLink].usdtSpot *
                  usdt?.[usdt.currentValidLink].usdt *
                  spread
                ).toFixed(4)}
              </p>
            ) : (
              "Carregando.."
            )}
          </div>
          <p className="text-center">
            Última atualização:{" "}
            {usdt?.lastUpdate &&
              new Intl.DateTimeFormat("pt-br", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(usdt?.lastUpdate as string))}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
