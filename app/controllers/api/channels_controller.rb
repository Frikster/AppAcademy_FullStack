class Api::ChannelsController < ApplicationController
  def index
    @channels = Channel.all
    render :index
  end

  def new
  end

  def create
    @channel = Channel.new(channel_params)
    @channel.author_id = current_user.id
    @user = current_user
    if @channel.save
      #TODO: populate list with channel, maintaining alphabetical border
      render "api/channels/show"
    else
      render json: @channel.errors.full_messages, status: 422
    end
  end

  private
  def channel_params
    params.require(:channel).permit(:name, :direct_message_channel)
  end
end
