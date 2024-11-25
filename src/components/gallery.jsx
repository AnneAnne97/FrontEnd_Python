import React,{ useRef, useState } from "react";
import axios from 'axios';
import * as echarts from 'echarts' ;
import ReactPlayer from 'react-player';
import  saveAs from 'file-saver';


export const Gallery = (props) => {

  //const [data, setData] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const chartInstanceRef = useRef(null); 
  const [content, setContent] = useState(null);
  const [showChartButtons, setShowChartButtons] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

 const [videoFilePath, setVideoFilePath] = useState("http://127.0.0.1:8000/download/downloaded_video.mp4");
 const handleVideoUpload = (event) => {
  setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  };


  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
    setIsSubmitted(false); 
  };

  const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000', 
  });

  const fetchData = async () => {
    try {
      if (videoUrl.trim() !== '') {
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      
          const response = await apiClient.post(
            '/get_high_freq_data/', 
            { danmaku: videoUrl },  
            {
              headers: {
                'Content-Type': 'application/json',  
                'X-CSRFToken': csrftoken,            
              },
            }
          );
          console.log(response.data); 
  
      setShowChartButtons(true);
      setContent('ChartData');
      setData(response.data);
    
        }else{
          alert('视频URL不能为空!')
        }
 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderChart = (chartType) => {
    // Logic to render the respective chart based on the selected chart type (pie, line, scatter)
    console.log(`Rendering ${chartType} chart`);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose(); // Dispose the existing chart
    }

    // Create a new chart

    const chart = echarts.init(document.getElementById('main'));
    chartInstanceRef.current = chart;

    const option = {
      title: {
        text: '高频词'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.words
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data.counts,
        type: chartType
      }]
    };
    chart.setOption(option);
    // Example: render pie, line, or scatter chart based on chartType
  };

  const handleFetchMaxDanmaku = async () => {
    try {
      if (videoUrl.trim() !== '') {
      setShowChartButtons(false);
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

      const response = await apiClient.post(
        '/get_max_danmaku/',  
        { danmaku: videoUrl }, 
        {
          headers: {
            'Content-Type': 'application/json',  
            'X-CSRFToken': csrftoken,            
          },
        }
      );

      setContent('MaxDanmaku');
      setData(response.data);
    }else{
      alert('视频URL不能为空!')
    }
  
    } catch (error) {
      setError(error.message);  
      console.error('Error:', error);
    }
  };

  const handleDownloadVideo = async () => {
    try {
      if (videoUrl.trim() !== '') {
      setShowChartButtons(false);
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      const response = await apiClient.post(
        '/download_video/',  
        { url: videoUrl }, 
        {
          headers: {
            'Content-Type': 'application/json',  
            'X-CSRFToken': csrftoken,           
          },
        }
      );

      setContent('VideoData');
      alert(response.data);  

            const fileUrl = 'http://127.0.0.1:8000/download/downloaded_video.mp4'; // Replace with your MP4 file URL
            // Fetch the video as a Blob (binary large object)
      fetch(fileUrl)
      .then((response) => response.blob()) // Get the Blob from the response
      .then((blob) => {
        // Use file-saver's saveAs function to save the Blob as a file
        saveAs(blob, 'downloaded_video.mp4');
      })
      .catch((error) => {
        console.error('Error downloading video:', error);
      });
    }else{
      alert('视频URL不能为空!')
    }
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      if (videoUrl.trim() !== '') {

        setShowChartButtons(false);
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const response = await apiClient.post(
          '/download_excel/',  
          { url: videoUrl }, 
          {
            headers: {
              'Content-Type': 'application/json',  
              'X-CSRFToken': csrftoken,           
            },
          }
        );
  
        setContent('VideoData');
        alert(response.data);  

      setShowChartButtons(false);
      const fileUrl = 'http://127.0.0.1:8000/download/output.xlsx'; // Replace with your MP4 file URL
            // Fetch the video as a Blob (binary large object)
      fetch(fileUrl)
      .then((response) => response.blob()) // Get the Blob from the response
      .then((blob) => {
        // Use file-saver's saveAs function to save the Blob as a file
        saveAs(blob, 'output.xlsx');
      })
      .catch((error) => {
        console.error('Error downloading excel:', error);
      });
    }else{
      alert('视频URL不能为空!')
    }
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };
  

  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Tool 开始使用</h2>
          <p>
          输入想要分析的B站网址，不能为空，然后点击按钮开始数据分析。
          </p>
        </div>
        <div>
          <input className="form-control input-custom input-lg page-scroll" type="text"  id="video-url"  placeholder="请输入视频URL"  value={videoUrl} onChange={handleInputChange}/>&nbsp;
          <input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}"/>
          <br></br>
          <button id="fetch-data-btn"  className="btn btn-custom btn-lg page-scroll" onClick={fetchData}>获取高频词数据</button> &nbsp;
          <button id="fetch-max-danmaku-btn"  className="btn btn-custom btn-lg page-scroll" onClick={handleFetchMaxDanmaku} >获取弹幕最多时间段</button> &nbsp;
          <button id="download-video-btn"  className="btn btn-custom btn-lg page-scroll" onClick={handleDownloadVideo} >下载视频</button> &nbsp;
          <button id="download-video-btn"  className="btn btn-custom btn-lg page-scroll" onClick={handleDownloadExcel} >下载数据Excel</button> &nbsp;
          <br></br>
          {showChartButtons && (
        <div className="chart-buttons-container">
          <br></br>
          <button
            className="btn btn-custom-chart  btn-lg"
            onClick={() => renderChart('bar')}
          >
            Bar 
          </button>
          &nbsp;
          &nbsp;
          <button
            className="btn btn-custom-chart   btn-lg"
            onClick={() => renderChart('line')}
          >
            Line
          </button>
          &nbsp;
          &nbsp;
          <button
            className="btn btn-custom-chart  btn-lg"
            onClick={() => renderChart('scatter')}
          >
            Scatter
          </button>
        </div>
      )}
          {data &&content==='ChartData'? (
            <div id="main" style={{ top: '50px',left:'250px',width: '600px', height: '400px' }}></div>
            
          ) : (
            <p></p>
          )}

          {data &&content==='MaxDanmaku'? (
              <div >
                <br></br>
                <br></br>
                 <p>
                {'弹幕数量最多的时间段：' + (data.start_time ?? '数据加载中') + 's - ' + 
                (data.end_time ?? '数据加载中') + 's，弹幕数量：' + 
                (data.count ?? '数据加载中')}
              </p>
              </div>
            ) : (
            <p></p>
              )}
          
          {content==='VideoData'? (
                  <div className='player-wrapper'>
                  <ReactPlayer url={videoFilePath} width="100%" height="100%" controls={true} />
              </div>
            
            ) : (
            <p></p>
              )}

        </div>
      </div>
    </div>
  );
};
