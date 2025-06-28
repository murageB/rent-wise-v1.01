require "test_helper"

class MaintenanceRequestsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get maintenance_requests_index_url
    assert_response :success
  end

  test "should get show" do
    get maintenance_requests_show_url
    assert_response :success
  end

  test "should get new" do
    get maintenance_requests_new_url
    assert_response :success
  end

  test "should get edit" do
    get maintenance_requests_edit_url
    assert_response :success
  end
end
