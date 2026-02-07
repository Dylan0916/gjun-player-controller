我目前在使用一個網站透過影片來學習英文，但該網站沒有快捷鍵功能，例如播放、暫停、播放速度變快、播放速度變慢、快進、倒退、全螢幕，所以我想自己寫一個插件去控制。

專案細節：
- 可以自訂快捷鍵做到播放、暫停、播放速度變快、播放速度變慢、快進、倒退、全螢幕，預設快捷鍵為：
  - 播放：空白鍵
  - 暫停：空白鍵
  - 播放速度變快："shift" + ">"
  - 播放速度變慢："shift" + "<"
  - 快進：右箭頭
  - 倒退：左箭頭
  - 全螢幕："f"
- UI 使用 vue + unocss。
- 執行的網站：https://fs1.abconline.com.tw/course/player/index.htm
- 該網站的 player js: https://fs1.abconline.com.tw/course/player/main/player.js?v=202405
- 該網站的 htm 內容，你分析一下怎麼做到播放、暫停、播放速度變快、播放速度變慢、快進、倒退、全螢幕：
```
<!DOCTYPE html>
<html>
<head>
	<title>Player</title>
	<meta charset="utf-8" />
	<meta content="ie=edge,chrome=1" http-equiv="X-UA-Compatible">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" type="text/css" href="main/font-awesome.css" />
	<link rel="stylesheet" type="text/css" href="main/module.css?ver=180808" />
	<link rel="stylesheet" type="text/css" href="main/tooltipster.bundle.min.css" />
	<link rel="stylesheet" type="text/css" href="main/tooltipster-sideTip-borderless.min.css" />
	<script language="JavaScript" type="text/javascript" src="main/jquery.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/jquery.fullscreen.min.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/method.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/modernizr.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/Javascript_Code_library.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/Javascript_eXtension_library.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/systemCheck.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/dragsObject.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/MediaPlayer.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/controlPlayBar.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/base64.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/tooltipster.bundle.min.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/main.js"></script>
	<script language="JavaScript" type="text/javascript" src="main/player.js?v=202405"></script>
	<script language="JavaScript" type="text/javascript" src="main/axios/1.6.8/axios.min.js" integrity="sha512-PJa3oQSLWRB7wHZ7GQ/g+qyv6r4mbuhmiDb8BjSFZ8NZ2a42oTtAq5n0ucWAwcQDlikAtkub+tPVCw4np27WCg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script>
		function downloadFile(url) {
			const progressBar = document.getElementById('progressBar');
			const ply_download_per = document.getElementById('ply_download_per');
			const ply_download = document.getElementById('ply_download');
			progressBar.style.display = 'block'; // 顯示進度條
			ply_download.style.display = 'none'; // 隱藏下載按鈕
			ply_download_per.style.display = ''; // 顯示進度
			ply_download_per.textContent = '0%'; // 更新文字
            const fileName = url.substring(url.lastIndexOf('/') + 1);

			axios({
				url: url,
				method: 'GET',
				responseType: 'blob',
				onDownloadProgress: function (progressEvent) {
					const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					//console.log(`下載進度: ${percentCompleted}%`);
					progressBar.textContent = `Downloading... ${percentCompleted}%`; //更新進度文字
					ply_download_per.textContent = `${percentCompleted}%`; //更新進度文字
				}
			})
				.then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
                    link.setAttribute('download', fileName);
					document.body.appendChild(link);
					link.click();
					progressBar.style.display = 'none'; // 下載完成後隱藏進度條
					ply_download_per.style.display = 'none'; // 下載完成後隱藏進度條
					ply_download.style.display = ''; // 顯示下載按鈕
				})
				.catch((error) => {
					console.error('下載檔案時發生錯誤:', error);
					progressBar.style.display = 'none'; // 下載完成後隱藏進度條
					ply_download_per.style.display = 'none'; // 下載完成後隱藏進度條
					ply_download.style.display = ''; //顯示下載按鈕
				});
		}
	</script>
	<style>
		#progressBar {
			position: fixed;
			top: 0;
			left: 0;
			background-color: #000;
			color: #fff;
			padding: 10px;
			z-index: 9999;
		}
	</style>
</head>
<body>
	<div class="">
		<div id="container">
			<div id="main">
				<div id="mv"></div>
				<div id="bigplay" style="display:none;"><div id="circleLoading" onClick="touchBoard();"><button class="fa fa-play play" aria-hidden="true"></button></div></div>
				<div id="player" class="is-show" onMouseOver="showPlayer0(1);" onMouseOut="showPlayer0(0);" style="display: none;">
					<div class="playerinner">
						<div id="playerbar">
							<div id="ply_bar">
								<div id="timelabel"></div>
								<table id="currentTime" width="0" height="5" border="0" cellspacing="0" cellpadding="0" class="ply_bar_color">
									<tr>
										<td></td>
									</tr>
								</table>
							</div>
							<div id="ply_btn" style="visibility:visible;">
								<button unselectable="on" id="ply_take" style="position:absolute;left:-7px;top:0px;" ontouchstart="drag(this,event);" onMouseDown="drag(this,event);"></button>
								<button id="ply_takeg" style="position:absolute;left:-7px;top:0px;"></button>
							</div>
						</div>

						<div id="controlbtn">
							<div id="ply_showtime"><font id="time_txt" class="txta_14_gray"></font></div>
							<div class="ply_left">
								<button id="ply_backward" class="fa fa-backward tooltip" aria-hidden="true" title="倒轉" onClick="Backward();"></button>
								<div class="playgroup">
									<button id="ply_play" class="fa fa-play tooltip" aria-hidden="true" title="播放" onClick="Play();"></button>
									<button id="ply_pause" class="fa fa-pause tooltip" aria-hidden="true" title="暫停" onClick="Pause();"></button>
								</div>
								<button id="ply_forward" class="fa fa-forward tooltip" aria-hidden="true" title="快轉" onClick="Forward();"></button>
								<button id="ply_stop" class="fa fa-stop tooltip" aria-hidden="true" title="停止" onClick="Stop();"></button>
							</div>
							<div class="ply_right">
								<div id="ply_vol" class="tooltip" title="音量" onMouseOver="toggleVolControl();" onMouseOut="toggleVolControl();">
									<button id="vol_icon" class="fa fa-volume-up" aria-hidden="true" onClick="showVolControl();"></button>
									<div id="volcontrol" class="is-hide">
										<div id="vol_bar">
											<table id="currentVol" width="0" height="5" border="0" cellspacing="0" cellpadding="0" class="ply_bar_color">
												<tr>
													<td></td>
												</tr>
											</table>
										</div>
										<div id="vol_btn">
											<button unselectable="on" id="vol_take" style="position:absolute;left:0px;top:-5px;" ontouchstart="volDrag(this,event);" onMouseDown="volDrag(this,event);"></button>
										</div>
									</div>
								</div>
								<!--<a download id="ply_download" class="fa fa-download tooltip" aria-hidden="true" title="下載"></a>-->
								<div id="ply_download" class="fa fa-download tooltip" aria-hidden="true" title="下載"></div>
								<div id="ply_download_per" class="fa tooltip" aria-hidden="true" title="下載進度" style="display:none"></div>
								<div id="ply_screen"><button class="fa fa-arrows-alt tooltip" aria-hidden="true" title="全螢幕" onClick="FullScreen();"></button><button class="fa fa-compress tooltip" aria-hidden="true" title="結束全螢幕" onClick="FullScreen();"></button></div>
								<div id="ply_settings"><button class="fa fa-cog tooltip" aria-hidden="true" title="速度" onClick="toggleSettings();"></button></div>
							</div>
						</div>
						<div id="settings" class="is-hide">
							<div onClick="mvRate(0.5, this);"><span class="" aria-hidden="true">&nbsp;</span><span>0.5</span></div>
							<div onClick="mvRate(0.75, this);"><span class="" aria-hidden="true">&nbsp;</span><span>0.75</span></div>
							<div onClick="mvRate(1, this);"><span class="fa fa-check" aria-hidden="true">&nbsp;</span><span>正常</span></div>
							<div onClick="mvRate(1.25, this);"><span class="" aria-hidden="true">&nbsp;</span><span>1.25</span></div>
							<div onClick="mvRate(1.5, this);"><span class="" aria-hidden="true">&nbsp;</span><span>1.5</span></div>
							<div onClick="mvRate(2, this);"><span class="" aria-hidden="true">&nbsp;</span><span>2</span></div>
						</div>
					</div>
					<div class="logo"></div>
				</div>
			</div>
		</div>
	</div>
	<div id="progressBar" style="display: none;">Downloading...</div>
</body>
</html>
```