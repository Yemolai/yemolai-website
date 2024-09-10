# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     YemolaiWebsite.Repo.insert!(%YemolaiWebsite.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias YemolaiWebsite.Repo
alias YemolaiWebsite.Accounts

defmodule Create do
  def user(email, password, username, first_name) do
    user(email, password, username, first_name, true)
  end

  def user(email, password, username, first_name, active) when active == true do
    {:ok, user} =
      Accounts.register_user(%{
        first_name: first_name,
        username: username,
        email: email,
        password: password
      })

    {encoded_token, user_token} = Accounts.UserToken.build_email_token(user, "confirm")
    Repo.insert!(user_token)
    {:ok, created_user} = Accounts.confirm_user(encoded_token)

    {:ok, created_user}
  end

  def user(email, password, username, first_name, active) when active != true do
    Accounts.register_user(%{
      first_name: first_name,
      username: username,
      email: email,
      password: password
    })
  end
end

if Mix.env() == :dev do
  Create.user("admin@romulogabriel.com", "testpass12345", "rgadmin", "Romulo")
end
