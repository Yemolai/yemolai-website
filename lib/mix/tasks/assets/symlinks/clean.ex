defmodule Mix.Tasks.Assets.Symlinks.Clean do
  use Mix.Task

  @moduledoc """
    Removes all symbolic links for custom CSS and JS assets in priv/static/assets
  """

  def run(_) do
    target_dir = Path.expand("priv/static/assets", File.cwd!())

    if File.exists?(target_dir) do
      target_dir
      |> File.ls!()
      |> Enum.filter(&(String.ends_with?(&1, ".css") or String.ends_with?(&1, ".js")))
      |> Enum.reject(&(&1 in ["app.css", "app.js"]))
      |> Enum.each(&remove_symlink_if_exists(&1, target_dir))
    else
      IO.puts("Compiled assets directory does not exist, nothing to clean.")
    end
  end

  defp remove_symlink_if_exists(file, target_dir) do
    target_path = Path.join(target_dir, file)

    if File.exists?(target_path) and File.read_link(target_path) != :error do
      case File.rm(target_path) do
        :ok -> IO.puts("Removed symlink for #{file}")
        {:error, reason} -> IO.puts("Failed to remove symlink for #{file}: #{reason}")
      end
    else
      IO.puts("#{file} is not a symlink, skipping")
    end
  end
end
