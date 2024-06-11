defmodule YemolaiWebsite.Repo do
  use Ecto.Repo,
    otp_app: :yemolai_website,
    adapter: Ecto.Adapters.Postgres
end
