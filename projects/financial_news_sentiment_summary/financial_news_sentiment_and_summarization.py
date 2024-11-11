# imports
import toml
import finnhub
import datetime
from transformers import pipeline
import streamlit as st


# load API key
# get API Keys
#with open('secrets.toml', 'r') as f:
 #   config = toml.load(f)

#FINNHUB_API_KEY = config['FINNHUB']
FINNHUB_API_KEY = st.secrets['FINNHUB']
# function to get financial news
def financial_news(stock_ticker, start_date, end_date, include_headline=True, include_summary=False):
    """
    Retrieves financial news for a specified stock within a date range.

    Args:
        stock_ticker (str): The ticker symbol of the stock (e.g., "AAPL" for Apple Inc.).
        start_date (str): The start date for the news search in the format "YYYY-MM-DD".
        end_date (str): The end date for the news search in the format "YYYY-MM-DD".
        include_headline (bool, optional): If True, includes both headlines and summaries in the result.
                                           Defaults to True.

    Returns:
        str: A concatenated string of headlines and summaries for the specified stock within the date range.
             If `include_headline` is False, only the summary is included.
    """
    finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)
    news_list = finnhub_client.company_news(stock_ticker, _from=start_date, to=end_date)

    news = ''
    for news_i in news_list:
        if stock_ticker in news_i['headline']:
            if include_headline:
                news = news + ' ' + news_i['headline'] + '.\n\n'
            if include_summary:
                news = news + ' ' + news_i['summary'] + '.\n\n'

    return news

# get financial news summary
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def get_news_summary(news, summarizer):
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    news_summary = summarizer(news)
    return news_summary[0]['summary_text']

# APP
st.title('Financial News Summarization and Sentiment')
st.write('Enter the stock ticker and period for which you want financial news.')
stock_ticker = st.text_input('Stock Ticker:', 'AAPL')
start_date = st.date_input('Start Date:', datetime.datetime.today()-datetime.timedelta(days=20))
end_date = st.date_input('End Date:', datetime.datetime.today())
news = financial_news(stock_ticker, start_date, end_date)
st.markdown(news)

st.header('Financial News Sentiment')

st.header('Financial News Summary')
news_summary = get_news_summary(news, summarizer)
st.write(news_summary)