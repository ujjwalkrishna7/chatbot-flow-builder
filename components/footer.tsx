import Link from "next/link";
import { Container } from "./container";
import { GithubIcon } from "./icons/github";
import { Logo } from "./icons/logo";
import { TwitterIcon } from "./icons/twitter";

export const Footer = () => (
  <footer className=" mt-16 border-t border-transparent-white py-5 text-sm">
    <Container className="">
      <div className="flex items-center justify-between flex-col md:flex-row w-full gap-2">
        <div className="flex items-center text-grey gap-2">
          <Logo className="mr-4 h-4 w-4" />
          <p className="font-medium text-md">Chatbot Flow Builder</p> -
          <p className="text-white/30 text-sm"> Designed by Ujjwal Krishna</p>
        </div>
        <div className="mt-auto flex space-x-4 text-grey">
          <Link href={"https://twitter.com/ujjwalkrishna7"}>
            <TwitterIcon className="cursor-pointer" />
          </Link>
          <Link href={"https://github.com/ujjwalkrishna7"}>
            <GithubIcon className="cursor-pointer" />
          </Link>
        </div>
      </div>
    </Container>
  </footer>
);
