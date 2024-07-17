defmodule Mix.Tasks.Assets.CssSymlinks do
  use Mix.Task

  @moduledoc """
    Creates symbolic links for all custom CSS files from assets/css to priv/static/assets for dev environments to map in real time without calling digest on changes.
  """

  @shortdoc "Creates symbolic links for all custom CSS files"

  def run(_) do
    source_dir = Path.expand("assets/css", File.cwd!())
    target_dir = Path.expand("priv/static/assets", File.cwd!())

    File.mkdir_p!(target_dir)

    source_dir
    |> File.ls!()
    |> Enum.filter(&String.ends_with?(&1, ".css"))
    |> Enum.reject(&(&1 == "app.css"))
    |> Enum.each(&create_symlink(&1, source_dir, target_dir))
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
