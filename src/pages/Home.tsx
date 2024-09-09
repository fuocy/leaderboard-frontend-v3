import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { clsx } from "clsx";
import { useAuthStore } from "../store/useAuthStore";

type Role = "creator" | "player";
const Login = () => {
  const [username, setUsername] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const roles = [
    { id: "creator", title: "Creator" },
    { id: "player", title: "Player" },
  ];
  const [role, setRole] = React.useState(roles[0].id);

  const handleLogin = () => {
    if (username && role) {
      login(username, role as Role);
      navigate(role === "creator" ? "/creator-dashboard" : "/player-dashboard");
    }
  };

  return (
    <div className="bg-[url('https://jamango.io/latest/assets/frontend/character-circle-offset.webp')] bg-cover bg-center min-h-screen relative brightness-90">
      <header className="pt-6 text-center lg:absolute lg:left-4">
        <a className="inline-flex flex-shrink-0 items-center" href="/">
          <img
            src="https://jamango.io/latest/assets/frontend/jamango-logo.webp"
            alt=""
            className="w-48"
          />
        </a>
      </header>
      <form className="bg-white rounded-3xl px-7 pt-14 max-w-[400px] w-[80%] shadow-md min-h-[300px] absolute right-10 top-1/2 -translate-y-1/2">
        <div className="rounded-2xl bg-gradient-to-t p-3 from-[#FFB300] to-[#FF6F02] absolute -top-12 left-1/2 hidden -translate-x-1/2 lg:block">
          <img
            src="https://jamango.io/latest/assets/frontend/jamango-letters-no-shadow.svg"
            alt=""
            className="size-16 opacity-90 shadow-md"
            width="635"
            height="597"
          />
        </div>
        <h1 className="font-medium text-center text-[28px]  text-gray-800">
          Leaderboard!
        </h1>
        <input
          className="items-center gap-2 rounded-md border px-4 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:opacity-50 border-transparent bg-slate-100 text-slate-900 placeholder:text-slate-600 py-2 block w-full flex-1 text-lg xl:ml-auto xl:max-w-md mt-3"
          name="access-code"
          id="access-code"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <RadioGroupPrimitive.Root
          aria-label="roles"
          defaultValue={"creator"}
          onValueChange={setRole}
        >
          <div className="flex gap-5 items-center mt-4 ">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex gap-3 !items-center !justify-center"
              >
                <RadioGroupPrimitive.Item
                  id={role.id}
                  value={role.id}
                  className={clsx(
                    "relative w-6 h-6 rounded-full",
                    "border border-gray-300 bg-gray-100",
                    "radix-state-checked:bg-orange-500",
                    "radix-state-unchecked:bg-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-orange-500"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center leading-0 bg-orange-500 rounded-full radix-state-unchecked:!bg-gray-300">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>
                <label
                  htmlFor={role.id}
                  className="block text-lg font-medium text-gray-900 "
                >
                  {role.title}
                </label>
              </div>
            ))}
          </div>
        </RadioGroupPrimitive.Root>
        <button
          onClick={handleLogin}
          type="button"
          className="w-full block bg-blue-500 py-3 rounded-2xl mt-4 shadow-md text-white text-lg hover:brightness-110 active:translate-y-1 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
