defmodule Mix.Tasks.Assets.Symlinks do
  use Mix.Task

  @moduledoc """
    Creates symbolic links for all custom CSS files from assets/css to priv/static/assets for dev environments to map in real time without calling digest on changes.
  """

  @shortdoc "Creates symbolic links for all custom CSS files"

  def run(_) do
    css_dir = Path.expand("assets/css", File.cwd!())
    js_dir = Path.expand("assets/js", File.cwd!())
    target_dir = Path.expand("priv/static/assets", File.cwd!())

    File.mkdir_p!(target_dir)

    [
      {css_dir, ".css", ["app.css"]},
      {js_dir, ".js", ["app.js"]}
    ]
    |> Enum.flat_map(fn {dir, ext, skip} ->
      dir
      |> File.ls!()
      |> Enum.filter(&String.ends_with?(&1, ext))
      |> Enum.reject(&(&1 in skip))
      |> Enum.map(&{&1, dir})
    end)
    |> Enum.each(fn {file, source_dir} ->
      create_symlink(file, source_dir, target_dir)
    end)
  end

  defp create_symlink(file, source_dir, target_dir) do
    source_path = Path.join(source_dir, file)
    target_path = Path.join(target_dir, file)

    case File.ln_s(source_path, target_path) do
      :ok -> IO.puts("Created symlink for #{file}")
      {:error, :eexist} -> IO.puts("Symlink already exists for #{file}")
      {:error, reason} -> IO.puts("Failed to create symlink for #{file}: #{reason}")
    end
  end
end
