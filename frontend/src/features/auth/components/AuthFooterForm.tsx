import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { StatItem, StatsGroup } from "@/components/ui/stats";
import { FcGoogle } from "react-icons/fc";
import { LuCode, LuRocket, LuUsers } from "react-icons/lu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AuthFooterForm() {
  return (
    <>
      {/* Separator */}
      <FieldSeparator className="mb-6">OU</FieldSeparator>

      {/* Google Button */}
      <Button type="button" variant="social" size="lg" className="w-full mb-8">
        <FcGoogle size={22} />
        <span>Continuar com Google</span>
      </Button>

      {/* Stats */}
      <StatsGroup className="mb-6">
        <StatItem icon={<LuUsers size={18} />} value="5K+" label="Usuários" />
        <StatItem icon={<LuCode size={18} />} value="50K+" label="Desafios" />
        <StatItem icon={<LuRocket size={18} />} value="100+" label="Cursos" />
      </StatsGroup>

      {/* Terms */}
      <footer className="text-center">
        <p className="text-white-2 text-xs leading-relaxed">
          Ao se inscrever você concorda com os{" "}
          <Dialog>
            <DialogTrigger asChild>
              <span className="link">Termos de Uso</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Termos de Uso</DialogTitle>
                <DialogDescription>Termos de Uso</DialogDescription>
              </DialogHeader>
              <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <p key={index} className="mb-4 leading-normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>{" "}
          e{" "}
          <Dialog>
            <DialogTrigger asChild>
              <span className="link">Políticas de Privacidade</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Políticas de Privacidade</DialogTitle>
                <DialogDescription>Políticas de Privacidade</DialogDescription>
              </DialogHeader>
              <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <p key={index} className="mb-4 leading-normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </p>
      </footer>
    </>
  );
}
