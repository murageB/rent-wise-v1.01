require "test_helper"

class MaintenanceRequestsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    @user = users(:one)
    sign_in @user
  end

  test "should get index" do
    get maintenance_requests_url
    assert_response :success
  end

  test "should get show" do
    get maintenance_request_url(maintenance_requests(:one))
    assert_response :success
  end

  test "should get new" do
    get new_maintenance_request_url
    assert_response :success
  end

  test "should get create" do
    post maintenance_requests_url, params: { maintenance_request: { property_id: 1, unit_id: 1, tenant_id: 1, title: "Test Request", description: "Test Description", priority: "medium", status: "open" } }
    assert_response :success
  end

  test "should get edit" do
    get edit_maintenance_request_url(maintenance_requests(:one))
    assert_response :success
  end

  test "should get update" do
    patch maintenance_request_url(maintenance_requests(:one)), params: { maintenance_request: { title: "Updated Title" } }
    assert_response :success
  end

  test "should get destroy" do
    delete maintenance_request_url(maintenance_requests(:one))
    assert_response :success
  end
end
