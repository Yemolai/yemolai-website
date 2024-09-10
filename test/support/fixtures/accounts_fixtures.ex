defmodule YemolaiWebsite.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `YemolaiWebsite.Accounts` context.
  """

  def unique_username, do: "user_#{System.unique_integer()}"
  def unique_user_email, do: "user#{System.unique_integer()}@example.com"
  def valid_user_password, do: "hello world!"
  def valid_first_name, do: "first_name"

  def valid_user_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      first_name: valid_first_name(),
      username: unique_username(),
      email: unique_user_email(),
      password: valid_user_password()
    })
  end

  def user_fixture(attrs) do
    {:ok, user} =
      attrs
      |> valid_user_attributes()
      |> YemolaiWebsite.Accounts.register_user()

    if Map.get(attrs, :confirmed, true) == true do
      {encoded_token, user_token} = YemolaiWebsite.Accounts.UserToken.build_email_token(user, "confirm")
      YemolaiWebsite.Repo.insert!(user_token)
      {:ok, confirmed_user} = YemolaiWebsite.Accounts.confirm_user(encoded_token)

      confirmed_user
    else
      user
    end
  end

  def user_fixture() do
    user_fixture(%{})
  end

  def extract_user_token(fun) do
    {:ok, captured_email} = fun.(&"[TOKEN]#{&1}[TOKEN]")
    [_, token | _] = String.split(captured_email.text_body, "[TOKEN]")
    token
  end
end
