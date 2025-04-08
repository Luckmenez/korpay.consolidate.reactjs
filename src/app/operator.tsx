import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Moon, Sun } from "lucide-react";

export function Operator() {
  const { theme, setTheme } = useTheme();
  const spreads = [
    0.8, 0.75, 0.72, 0.7, 0.66, 0.65, 0.63, 0.6, 0.58, 0.53, 0.5, 0.48, 0.45,
  ];

  const coinBase = 5.65;
  const dataCurrency = 5.5;
  const investing = 5.4;

  return (
    <div className="relative">
      <Button
        className="absolute top-4 right-4"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
      <div className="h-screen flex items-center w-7xl m-auto bg-background font-nunito">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-300 hover:bg-gray-300/80 ">
              <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                Spread
              </TableHead>
              <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                CoinBase
              </TableHead>
              <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                DataCurrency
              </TableHead>
              <TableHead className="text-center text-secondary-foreground dark:text-primary-foreground">
                Investing
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spreads.map((spread) => (
              <TableRow
                key={spread}
                className="bg-background hover:bg-black/20"
              >
                <TableCell className="text-center text-secondary-foreground">
                  {spread}
                </TableCell>
                <TableCell className="text-center text-secondary-foreground">
                  {(coinBase * spread).toFixed(4)}
                </TableCell>
                <TableCell className="text-center text-secondary-foreground">
                  {(dataCurrency * spread).toFixed(4)}
                </TableCell>
                <TableCell className="text-center text-secondary-foreground">
                  {(investing * spread).toFixed(4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
