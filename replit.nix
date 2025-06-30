{ pkgs }: {
  env = { LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid]; };
  deps = [
    pkgs.zip
    pkgs.unzipNLS
        pkgs.libuuid

  ];
}