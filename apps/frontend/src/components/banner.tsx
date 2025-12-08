interface BannerProps {
  className?: string;
  children?: React.ReactNode;
}

export function Banner({ className, children }: BannerProps) {
  return (
    <div
      className={`relative bg-cover bg-center bg-no-repeat bg-fixed ${
        className || ""
      }`}
      style={{
        backgroundImage: `url(/img/vaquita-banner.jpg)`,
        minHeight: className?.includes("min-h") ? undefined : "100vh",
      }}
    >
      <div className="absolute inset-0 bg-crema/70"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
