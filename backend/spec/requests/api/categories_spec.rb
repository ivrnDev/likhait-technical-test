require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food", emoji: "🍔") }
    let!(:transport) { Category.create!(name: "Transport", emoji: "🚗") }
    let!(:supplies) { Category.create!(name: "Supplies", emoji: "🗃️") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

   describe "POST /api/categories" do
    let(:valid_params) do
      {
        category: {
          name: "Entertainment",
          emoji: "🎬"
        }
      }
    end

    it "creates a category" do
      expect {
        post "/api/categories", params: valid_params, as: :json
      }.to change(Category, :count).by(1)

      expect(response).to have_http_status(:created)

      json = JSON.parse(response.body)

      expect(json["name"]).to eq("Entertainment")
      expect(json["emoji"]).to eq("🎬")
    end

    it "does not create a category with invalid parameters" do
      invalid_params = {
        category: {
          name: "",
          emoji: ""
        }
      }

      expect {
        post "/api/categories", params: invalid_params, as: :json
      }.not_to change(Category, :count)

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/categories/:id" do
    let!(:category) { Category.create!(name: "Food", emoji: "🍔") }

    it "updates the category" do
      patch "/api/categories/#{category.id}",
        params: {
          category: {
            name: "Restaurants",
            emoji: "🍽️"
          }
        },
        as: :json

      expect(response).to have_http_status(:success)

      json = JSON.parse(response.body)

      expect(json["name"]).to eq("Restaurants")
      expect(json["emoji"]).to eq("🍽️")

      category.reload

      expect(category.name).to eq("Restaurants")
      expect(category.emoji).to eq("🍽️")
    end

    it "returns not found for a nonexistent category" do
      patch "/api/categories/999999",
        params: {
          category: {
            name: "Restaurants",
            emoji: "🍽️"
          }
        },
        as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/categories/:id" do
    let!(:category) { Category.create!(name: "Food", emoji: "🍔") }

    it "deletes the category" do
      expect {
        delete "/api/categories/#{category.id}"
      }.to change(Category, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "returns not found for a nonexistent category" do
      delete "/api/categories/999999"

      expect(response).to have_http_status(:not_found)
    end
  end
end
