# .idx/dev.nix - Project IDX Configuration
{ pkgs, ... }: {
  # Enable previews
  channel = "stable-23.11"; # or "unstable"
  
  # Use packages from Nixpkgs
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
  ];

  # Sets environment variables in the workspace
  env = {};

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "biomejs.biome"
      "bradlc.vscode-tailwindcss"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # The main web game preview
        web = {
          # Example: run "npm run dev" with PORT=$PORT
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          env = {
            # Environment variables for the preview
            PORT = "$PORT";
          };
        };
        # Dedicated Impact Dashboard preview
        dashboard = {
           command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
           manager = "web";
           env = {
             PORT = "$PORT";
           };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install dependencies
        npm-install = "npm ci --no-audit --prefer-offline || npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task
        # watch-css = "npm run watch-css";
      };
    };
  };
}
