{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.yarn
  ];
  env = {};
  idx = {
    extensions = [
      "bradlc.vscode-tailwindcss"
      "esbenp.prettier-vscode"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        npm-install = "npm install";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
