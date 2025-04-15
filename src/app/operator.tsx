import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@radix-ui/react-select";
import { Bitcoin, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";

interface UsdtDataResponse {
  currentValidLink: "coinBaseData" | "investingData" | "currencyDataFeedData";
  lastUpdate: string;
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

export function Operator() {
  const [usdt, setUsdt] = useState<UsdtDataResponse | null>(null);
  const [activeLink, setActiveLink] = useState("");
  const [password, setPassword] = useState("");
  const [activatedOnResponse, setActivatedOnResponse] = useState("");

  const { theme, setTheme } = useTheme();
  const spreads = [
    1.02, 1.015, 1.01, 1.009, 1.0085, 1.008, 1.0075, 1.0072, 1.007, 1.0066,
    1.0066, 1.0065, 1.0063, 1.006, 1.0058, 1.0053, 1.005, 1.0048, 1.0045,
  ];

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      transports: ["websocket"],
    });

    socket.emit("update");

    socket.on("connect", () => {
      console.log("Connected to WebSocket via Socket.IO");
    });

    socket.on("update", (data: UsdtDataResponse) => {
      console.log("Received data:", data.coinBaseData);
      setUsdt(data);
      setActivatedOnResponse(data.currentValidLink);
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

  async function handleSubmit() {
    if (!activeLink) {
      toast.error("Selecione um ativo.", {
        position: "top-right",
      });
      return;
    }
    if (password !== import.meta.env.VITE_PASSWORD) {
      toast.error("Senha incorreta.", {
        position: "top-right",
      });
      return;
    }
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/consolidation/current-link`,
        {
          link: activeLink,
        }
      );
      console.log("Resposta do servidor:", response.data);
      toast.success("Link atualizado com sucesso!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Erro ao atualizar o link:", error);
      toast.error("Erro ao atualizar o link.");
    }
  }

  return (
    <Dialog>
      <div className="relative">
        <DialogTrigger asChild className="absolute top-4 right-4">
          <Button onClick={() => {}}>
            <Bitcoin size={20} />
          </Button>
        </DialogTrigger>
        <Button
          className="absolute top-4 left-4"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <div className="h-screen flex items-center w-7xl m-auto bg-background font-nunito rounded-full">
          <Table className="border border-gray-300 w-full rounded-3xl">
            <TableHeader>
              <TableRow className="bg-gray-300 hover:bg-gray-300/80 ">
                <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                  Spread
                </TableHead>
                <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                  CoinBase <br />
                  {usdt && usdt.coinBaseData.usdtSpot.toFixed(4)}
                </TableHead>
                <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                  DataCurrency
                  <br />
                  {usdt && usdt.currencyDataFeedData.usdtSpot}
                </TableHead>
                <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                  Investing
                  <br />
                  {usdt && usdt.investingData.usdtSpot}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spreads.map((spread) => (
                <TableRow
                  key={spread}
                  className="bg-background hover:bg-black/20"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `http://localhost:5173/?spread=${spread}`
                    );
                  }}
                >
                  <TableCell className="text-center text-secondary-foreground">
                    {spread}
                  </TableCell>
                  <TableCell className="text-center text-secondary-foreground">
                    {usdt
                      ? (
                          usdt?.coinBaseData.usdtSpot *
                          usdt?.coinBaseData.usdt *
                          spread
                        ).toFixed(4)
                      : "Carregando.."}
                  </TableCell>
                  <TableCell className="text-center text-secondary-foreground">
                    {usdt
                      ? (
                          usdt?.currencyDataFeedData.usdtSpot *
                          usdt?.currencyDataFeedData.usdt *
                          spread
                        ).toFixed(4)
                      : "Carregando.."}
                  </TableCell>
                  <TableCell className="text-center text-secondary-foreground">
                    {usdt
                      ? (
                          usdt?.investingData.usdtSpot *
                          usdt?.investingData.usdt *
                          spread
                        ).toFixed(4)
                      : "Carregando.."}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DialogContent className="bg-background p-10">
        <DialogTitle className="text-lg font-bold text-secondary-foreground">
          Editar Link Ativo
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <p>Ativo até próxima atualização: {activatedOnResponse}</p>
          <label htmlFor="link" className="text-secondary-foreground">
            Alterar Link:
          </label>
          <Select
            value={activeLink}
            onValueChange={(value) => setActiveLink(value)}
          >
            <SelectTrigger className="w-full rounded-md py-1.5 cursor-pointer ring-1 bg-white dark:bg-background/70">
              <SelectValue placeholder="Selecione um tipo">
                {activeLink}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="w-[var(--radix-select-trigger-width)] rounded-md bg-white text-black"
            >
              <SelectItem value="coinBaseData">CoinBase</SelectItem>
              <SelectItem value="currencyDataFeedData">
                CurrencyDataFeed
              </SelectItem>
              <SelectItem value="investingData">Investing</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Senha"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
          <Button onClick={handleSubmit}>Alterar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
