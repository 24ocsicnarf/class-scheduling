import React from "react";
import { cva } from "class-variance-authority";
import { IconType } from "react-icons";

const ButtonVariants = cva(
  [
    "font-medium",
    "ring-offset-1 focus:ring-4",
    "transition-all",
    "hover:duration-100 active:duration-100 blur:duration-100",
    "disabled:opacity-50",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      intent: {
        primary: ["focus:ring-blue-300"],
        secondary: ["focus:ring-sky-300"],
        neutral: ["focus:ring-gray-300"],
        danger: ["focus:ring-red-300"],
      },
      fill: {
        solid: [],
        outline: [],
        ghost: [],
      },
      size: {
        small: ["text-sm", "px-2.5", "py-1.5"],
        medium: ["text-base", "px-3", "py-2"],
        large: ["text-lg", "px-3.5", "py-2.5"],
      },
      roundness: {
        square: "rounded-none",
        round: "rounded-md",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      // PRIMARY BUTTONS
      {
        intent: "primary",
        fill: "solid",
        class: [
          "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
          "text-white",
        ],
      },
      {
        intent: "primary",
        fill: "outline",
        class: [
          "border border-blue-500 hover:border-blue-600 active:border-blue-700",
          "text-blue-500 hover:text-white active:text-white",
          "bg-white hover:bg-blue-500 active:bg-blue-600",
        ],
      },
      {
        intent: "primary",
        fill: "ghost",
        class: [
          "text-blue-500 hover:text-blue-600 active:text-blue-700",
          "bg-white hover:bg-blue-100 active:bg-blue-200",
        ],
      },
      // SECONDARY BUTTONS
      {
        intent: "secondary",
        fill: "solid",
        class: ["bg-sky-500 hover:bg-sky-600 active:bg-sky-700", "text-white"],
      },
      {
        intent: "secondary",
        fill: "outline",
        class: [
          "border border-sky-500 hover:border-sky-600 active:border-sky-700",
          "text-sky-500 hover:text-white active:text-white",
          "bg-white hover:bg-sky-500 active:bg-sky-600",
        ],
      },
      {
        intent: "secondary",
        fill: "ghost",
        class: [
          "text-sky-500 hover:text-sky-600 active:text-sky-700",
          "bg-white hover:bg-sky-100 active:bg-sky-200",
        ],
      },
      // NEUTRAL BUTTONS
      {
        intent: "neutral",
        fill: "solid",
        class: [
          "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
          "text-white",
        ],
      },
      {
        intent: "neutral",
        fill: "outline",
        class: [
          "border border-gray-500 hover:border-gray-600 active:border-gray-700",
          "text-gray-500 hover:text-white active:text-white",
          "bg-white hover:bg-gray-600 active:bg-gray-700",
        ],
      },
      {
        intent: "neutral",
        fill: "ghost",
        class: [
          "text-gray-500 hover:text-gray-600 active:text-gray-700",
          "bg-white hover:bg-gray-100 active:bg-gray-200",
        ],
      },
      // DANGER BUTTONS
      {
        intent: "danger",
        fill: "solid",
        class: ["bg-red-500 hover:bg-red-600 active:bg-red-700", "text-white"],
      },
      {
        intent: "danger",
        fill: "outline",
        class: [
          "border border-red-500 hover:border-red-600 active:border-red-700",
          "text-red-500 hover:text-white active:text-white",
          "bg-white hover:bg-red-600 active:bg-red-700",
        ],
      },
      {
        intent: "danger",
        fill: "ghost",
        class: [
          "text-red-500 hover:text-red-600 active:text-red-700",
          "bg-white hover:bg-red-100 active:bg-red-200",
        ],
      },
    ],
    defaultVariants: {
      intent: "primary",
      fill: "solid",
      size: "medium",
      roundness: "round",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: "primary" | "secondary" | "neutral" | "danger";
  fill?: "solid" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  roundness?: "square" | "round" | "pill";
  leading?: IconType;
  trailing?: IconType;
  children: React.ReactNode;
}

const ButtonIcon: React.FC<{ as?: IconType; className: string }> = ({
  as: Icon = "MdCircle",
  className,
}) => {
  return <Icon className={className} />;
};

const Button = ({
  intent,
  fill,
  size,
  roundness,
  disabled,
  leading,
  trailing,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`${ButtonVariants({
        intent,
        fill,
        size,
        roundness,
      })} flex items-center justify-around`}
      disabled={disabled}
    >
      {leading == undefined ? undefined : (
        <ButtonIcon
          as={leading}
          className={`${
            children == undefined
              ? ""
              : size == "small"
              ? "me-1.5"
              : size == "large"
              ? "me-2.5"
              : `me-2`
          } ${
            size == "small"
              ? "h-3 w-3"
              : size == "large"
              ? "h-5 w-5"
              : `h-4 w-4`
          }`}
        ></ButtonIcon>
      )}
      {children == undefined ? (
        <span
          className={`${
            size == "small" ? "h-5" : size == "large" ? "h-7" : "h-6"
          }`}
        ></span>
      ) : (
        <span
          className={`${
            trailing == undefined
              ? ""
              : size == "small"
              ? "ms-[3px]"
              : size == "large"
              ? "ms-[5px]"
              : "ms-1"
          }`}
        >
          {children}
        </span>
      )}
      {trailing == undefined ? undefined : (
        <ButtonIcon
          as={trailing}
          className={`${
            children == undefined
              ? ""
              : size == "small"
              ? "h-3 w-3 ms-1.5"
              : size == "large"
              ? "h-5 w-5 ms-2.5"
              : `h-4 w-4 ms-2`
          }`}
        ></ButtonIcon>
      )}
    </button>
  );
};

export default Button;
