/*================================================================================*/
/*HTML 요소 전역변수*/
//채팅창 버튼
const CHAT_WINDOW_BTN = document.getElementById("chat-window-btn");
//채팅 컨텍스트
const CHAT_WINDOW = document.getElementById("chat-window");

//채팅 알림창
const CHAT_ALERT_CONT = document.getElementById("chat-alert-cont");

//채팅방 목록창 container
const CHAT_LIST_CONT = document.getElementById("chat-list-cont");
//빈 채팅방 목록
const CHAT_LIST_EMPTY = document.getElementById("chat-list-empty");
//일대일 목록창
const CHAT_LIST_OTO = document.getElementById("chat-list-oto-cont");
//다대다 목록창
const CHAT_LIST_OTM = document.getElementById("chat-list-otm-cont");
//채팅리스트창 헤더 채팅 개설 버튼
const CHAT_LIST_CREATE_BTN = document.getElementById("create-chat");
//채팅리스트창 푸터
const CHAT_LIST_FOOTER = document.getElementById("chat-list-footer");
//채팅방 목록창 푸터 버튼 <--이새끼들 필요없을거같은데
const CHAT_LIST_OTO_BTN = document.getElementById("chat-list-footer-oto-btn");
const CHAT_LIST_OTM_BTN = document.getElementById("chat-list-footer-otm-btn");

//채팅 생성 사이드창 배경
const CHAT_LIST_CREATE = document.getElementById("chat-list-create");
//사이드창 나가기 버튼
const CHAT_LIST_CREATE_CANCEL_BTN = document.getElementById("cancel-create-chat");
//채팅방 개설 유저 검색창
const CHAT_LIST_CREATE_USER_INPUT = document.getElementById("user-create-chat");

//채팅창 container
const CHAT_BODY_CONT = document.getElementById("chat-body-cont");
//채팅창 본문 컨테이너
const CHAT_BODY_INNER_CONT = document.getElementById("chat-body-inner-cont");
//채팅창 본문
const CHAT_BODY_MORE_INNER_CONT = document.getElementById("chat-body-more-inner-cont");
//채팅창 사이드바(사이드바 배경)
const CHAT_BODY_SIDEBAR_BACKGROUND = document.getElementById("chat-body-sidebar-background");
//title
const CHAT_BODY_TITLE = document.getElementById("chat-body-title");
//채팅창 나가기 버튼
const CHAT_BODY_QUIT_BTN = document.getElementById("quit-chat");
//채팅창 설정(사이드바) 버튼
/* 채팅창 사이드바 열기 */
const CHAT_BODY_SIDEBAR_OPEN_BTN = document.getElementById("open-chat-setting");
/* 채팅창 사이드바 닫기 */
const CHAT_BODY_SIDEBAR_CLOSE_BTN = document.getElementById("close-chat-setting");
/* 채팅 나가기(채팅 탈퇴) */
const CHAT_BODY_SIDEBAR_LEAVE_CHAT = document.getElementById("leave-chat");
//채팅 전송 버튼
const CHAT_BODY_SUBMIT_BTN = document.getElementById("submit-chat");
//채팅 입력창
const CHAT_BODY_INPUT = document.getElementById("input-chat");

/*================================================================================*/
/*기타 전역변수*/
//요일 배열
const CHAT_DAY_ARR = ["일", "월", "화", "수", "목", "금", "토"];

/*================================================================================*/
/*공유 워커 관련*/

let WORKER = null;

window.addEventListener("load", function(e) {
	if(!!window.SharedWorker) {
		//공유워커 지원 브라우저
		WORKER = new SharedWorker("http://localhost:8080/js/chat/chatworker.js", "tripfy-chatworker");

		WORKER.port.onmessage = (e) => {
			//공유워커에서 메세지 수신시
			//일단 콘솔로그만 해둠
			console.log("SharedWorder broadcasted data=" + e.data);
			console.log(e.data);
			switch(e.data.action) {
				case "broadcastChat":
					broadcastChatHandler(e.data.payload);
					break;
			}
		};

		window.addEventListener("beforeunload", (e) => {
			WORKER.port.postMessage({
				action: "closePort"
			});
		});

		WORKER.port.start();
	} else {
		//공유워커 미지원 브라우저
		window.close();
	}
});
/*
	!!!! 테스트
*/
// CHAT_BODY_INNER_CONT.addEventListener("scroll", (e) => {
// 	console.log(CHAT_BODY_INNER_CONT.scrollY);
// });

/*================================================================================*/
/*클릭이벤트 등록*/

//채팅창 버튼
CHAT_WINDOW_BTN.addEventListener("click", chatWindowBtnClick);
//채팅리스트창 푸터 버튼 클릭 감지
CHAT_LIST_FOOTER.addEventListener("click", chatListFooterBtnClick);
//채팅리스트 요소 클릭 감지
CHAT_LIST_OTO.addEventListener("click", chatListOTNElementClick);
CHAT_LIST_OTM.addEventListener("click", chatListOTNElementClick);
//채팅창 나가기 버튼 클릭
CHAT_BODY_QUIT_BTN.addEventListener("click", chatBodyQuitBtnClick);
//채팅 submit 버튼 클릭
CHAT_BODY_SUBMIT_BTN.addEventListener("click", chatBodySubmitBtnClick);
//채팅창 스크롤 감지 - 채팅 로딩
CHAT_BODY_INNER_CONT.addEventListener("scroll", chatRoomScrollEventReceiver);

/* 임시 */
CHAT_LIST_CREATE_BTN.addEventListener("click", (e) => CHAT_LIST_CREATE.classList.remove("cc-hidden"));
CHAT_LIST_CREATE_CANCEL_BTN.addEventListener("click", (e) => CHAT_LIST_CREATE.classList.add("cc-hidden"));
CHAT_LIST_CREATE.addEventListener("click", (e) => {
	if(e.target.id === e.currentTarget.id) {
		//배경 클릭시 창 닫기
		CHAT_LIST_CREATE.classList.add("cc-hidden");
	}
});

//채팅창 사이드바 열고 닫기
/* 사이드바 여는 버튼 */
CHAT_BODY_SIDEBAR_OPEN_BTN.addEventListener("click", (e) => {
	open_CHAT_BODY_SIDEBAR();
});
/* 배경 클릭으로 사이드바 닫기 */
CHAT_BODY_SIDEBAR_BACKGROUND.addEventListener("click", (e) => {
	if(e.target.id === e.currentTarget.id) {
		close_CHAT_BODY_SIDEBAR();
	}
});
/* 버튼 클릭으로 사이드바 닫기 */
CHAT_BODY_SIDEBAR_CLOSE_BTN.addEventListener("click", (e) => close_CHAT_BODY_SIDEBAR());

/*테스트*/
//document.getElementById("testChatCreate").addEventListener("click", createPackageChat);

/*================================================================================*/
/*패키지 채팅 생성*/
/*
	해당 패키지의 채팅이 이미 존재한다면 채팅방을 생성하는 대신
	존재하는 패키지 채팅을 띄워줌

	지역변수 packagenum은 해당 페이지의 packagenum으로 초기화되어야 함

	packagenum 이름이 겹침
	chat_packagenum으로 변경
	다만 port.postMessage 부분에서는 기존대로 함

	이제 임마는 패키지(문의) 채팅 생성용임
*/
async function createPackageChat(chat_packagenum) {
	console.log("createPackageChat(), chat_packagenum=" + chat_packagenum);
	console.log("IS_VD_LOADED=" + IS_VD_LOADED);

	//CHAT_OTO_VD 로드 확인
	if(!IS_VD_LOADED) {
		//로드되어있지 않으면(채팅창이 열린 적이 없으면) 로드해준다
		let data;
		try {
			//List<ChatListPayloadDTO> 받기
			data = await ajaxGet("localhost:8080", "/chat");
			console.log("ajaxGet('localhost:8080/chat') done, data=" + data);
		} catch(err) {
			//VD 로드 실패시
			/*실패 처리*/
			console.log("ajaxGet('localhost:8080/chat') fail");
			return;
		}

		//VD, DOM 처리(chatWindowBtnClick() 참조)
		setChatListVD(data);
		printChatList(data);
		IS_VD_LOADED = true;
	}

	//요청된 패키지 채팅이 이미 존재하는지 체크
	/*
		일대일 패키지 채팅만 체크, 패키지 다대다는 따로임

		roomType=1? && isTerminated=false 체크
	*/
	let tgtRoomIdx = null;
	let tgtVDIdx = null;
	let isChatRoomAlreadyExist = false;
	if(CHAT_OTO_VD.length > 0) {
		for(let i = 0; i < CHAT_OTO_VD.length; i++) {
			if(
				CHAT_OTO_VD[i].dataObj.roomType === 1
				&&
				!CHAT_OTO_VD[i].dataObj.isTerminated
				&&
				CHAT_OTO_VD[i].dataObj.pkgnum === chat_packagenum
			) {
				//이미 존재하는 경우
				tgtRoomIdx = CHAT_OTO_VD[i].dataObj.roomidx;
				tgtVDIdx = i;
				isChatRoomAlreadyExist = true;
				break;
			}
		}
	}

	//새 채팅 생성 분기
	if(!isChatRoomAlreadyExist) {
		//채팅 생성
		let res;
		try {
			res = await ajaxPost("localhost:8080", "/chat", {
				chatRoomType: 1,
				packagenum: chat_packagenum
			});
		} catch(err) {
			//신규 채팅 생성 관련 실패
			/*실패 처리*/
			console.log("ajaxPost('localhost:8080/chat') fail");
			console.log(err);
			return;
		}
		//받아온 ChatListPayloadDTO VD에 적용
		insertChatListVD(res);
		//VD로 DOM 수정
		adjustChatList();
		//roomidx 전달, VD 인덱스 초기화
		tgtRoomIdx = res.roomidx;
		tgtVDIdx = 0;
	}
	//채팅 오픈 요청
	WORKER.port.postMessage({
		action: "chatRoomEnter",
		payload: {
			roomidx: tgtRoomIdx
		}
	});
	//응답 대기/처리
	try {
		const res = await promised_waitTillResponse("chatRoomEnter");
		//모달 구성, 미확인 메시지 값 수정(chatListOTNElementClick() 참조)
		setChatBodyInfo(res.payload);
		printChatRoom(res.payload);
		//cc-hidden 컨트롤
		open_CHAT_WINDOW();
		open_CHAT_LIST_OTO();
		close_CHAT_LIST_CONT();
		open_CHAT_BODY_CONT();

		//미확인 메시지 값 수정
        UNCHECKED_MSG_COUNT -= CHAT_BODY_INFO.chatRoomInfo.uncheckedmsg;
        CHAT_OTO_VD[tgtVDIdx].uncheckedmsg = 0;

		//아래로 스크롤
        /*
            CBI.isEmpty가 null일 수도 있어서 false를 명시함
        */
		if(CHAT_BODY_INFO.isEmpty == false) {
			scrollIntoLastChatElement();
		}
	} catch(err) {
		//기존 채팅 오픈 실패
		/*실패 처리*/
		console.log("action: chatRoomEnter fail");
		return;
	}
}

/*일반 채팅 채팅창 내부 생성 관련*/

let userCreateChatInputTimeoutID = null;

//대화상대 검색창
function userCreateChatInputHandler(e) {
	if(userCreateChatInputTimeoutID !== null) {
		clearTimeout(userCreateChatInputTimeoutID);
	}

	userCreateChatInputTimeoutID = setTimeout(() => {
		// --> Ajax
	}, 1000);
}

/*================================================================================*/
/*이벤트 관련 함수*/

//채팅창 버튼 클릭
/*
	채팅창 열기 <-> 닫기
	이미 로드된 채팅창이 있을 경우 서버 요청을 하지 않음

	이거 나중에 기존 로드내역과 무관하게
	채탕창 열 때마다 다시 Ajax로 로드하게 바꿔주자
	그래야 편하게 새로고침할거아님
	+ 그런 경우 로드시마다 기존 채팅방리스트는 날리고 새로 넣어줘야 함
*/
function chatWindowBtnClick(e) {
	if(CHAT_WINDOW.classList.contains("cc-hidden")) {
		CHAT_WINDOW.classList.remove("cc-hidden");
		// if(CHAT_OTO_VD.length == 0 && CHAT_OTM_VD.length == 0) { <--매번 로드하게끔 임시로 가려둠
			//Ajax 호출
			ajaxGet("localhost:8080", "/chat")
			.then((data) => {
				console.log(data);
				setChatListVD(data);
				// printChatList();
				adjustChatList();
				//채팅 로드 여부 true로 변경
				IS_VD_LOADED = true;
			})
			.catch((error) => {
				/*
					에러 발생시 채팅창 전개를 막고
					오류 팝업을 띄워야 함
				*/
				console.log("err");
				console.log(error);
			});
		// }
	} else {
		CHAT_WINDOW.classList.add("cc-hidden");
	}
}

//채팅방 리스트창 푸터 버튼들 클릭
/*
	이벤트 버블링 사용
*/
function chatListFooterBtnClick(e) {
	if(e.target.parentElement.classList.contains("cc-footer-btn") || e.target.classList.contains("cc-footer-btn")) {
		const clickedId = e.target.parentElement.classList.contains("cc-footer-btn")
						? e.target.parentElement.id
						: e.target.id;
		switch(clickedId) {
			case "chat-list-footer-oto-btn":
				//일대일
				// if(CHAT_OTO_VD.length > 0) {
				// 	CHAT_LIST_EMPTY.classList.add("cc-hidden");
				// 	CHAT_LIST_CHATBOT.classList.add("cc-hidden");
				// 	CHAT_LIST_OTM.classList.add("cc-hidden");

				// 	CHAT_LIST_OTO.classList.remove("cc-hidden");
				// } else {
				// 	CHAT_LIST_CHATBOT.classList.add("cc-hidden");
				// 	CHAT_LIST_OTO.classList.add("cc-hidden");
				// 	CHAT_LIST_OTM.classList.add("cc-hidden");

				// 	CHAT_LIST_EMPTY.classList.remove("cc-hidden");
				// }
				open_CHAT_LIST_OTO();
				break;
			case "chat-list-footer-otm-btn":
				//다대다
				// if(CHAT_OTM_VD.length > 0) {
				// 	CHAT_LIST_EMPTY.classList.add("cc-hidden");
				// 	CHAT_LIST_CHATBOT.classList.add("cc-hidden");
				// 	CHAT_LIST_OTO.classList.add("cc-hidden");
					
				// 	CHAT_LIST_OTM.classList.remove("cc-hidden");
				// } else {
				// 	CHAT_LIST_CHATBOT.classList.add("cc-hidden");
				// 	CHAT_LIST_OTO.classList.add("cc-hidden");
				// 	CHAT_LIST_OTM.classList.add("cc-hidden");

				// 	CHAT_LIST_EMPTY.classList.remove("cc-hidden");
				// }
				open_CHAT_LIST_OTM();
				break;
		}
	}
}

//채팅리스트창 요소 클릭
/*
	이벤트 버블링 사용
*/
async function chatListOTNElementClick(e) {
	//oto/otm중 어디가 클릭되었는지 파악
	let targetID;
	if(e.currentTarget.id === "chat-list-oto-cont") {
		targetID = "otoele";
	} else {
		targetID = "otmele";
	}

	//클릭된 요소 id 찾기
	let targetEleId = null;

	if(e.target.parentElement.parentElement.id.split("-")[0] === targetID) {
		targetEleId = e.target.parentElement.parentElement.id;
	} else if(e.target.parentElement.id.split("-")[0] === targetID) {
		targetEleId = e.target.parentElement.id;
	} else if(e.target.id.split("-")[0] === targetID) {
		targetEleId = e.target.id;
	}

	//요소의 정보 가져오기
	let targetInfo = null;

	if(!!targetEleId) {
		for(let objEle of (targetID === "otoele" ? CHAT_OTO_VD : CHAT_OTM_VD)) {
			if(objEle.eleId === targetEleId) {
				targetInfo = objEle.dataObj;
				break;
			}
		}
		//일단 targetEleId와 일치하는 CHAT_OT*_VD[n].eleId 가 없는 경우는 체크하지 않음
		//웹소켓 연결 요청
		WORKER.port.postMessage({
			action: "chatRoomEnter",
			payload: {
				roomidx: targetInfo.roomidx
			}
		});
		//응답 대기/처리
		try {
			const res = await promised_waitTillResponse("chatRoomEnter");
			//모달 구성
			setChatBodyInfo(res.payload);
			printChatRoom(res.payload);
			//cc-hidden 컨트롤
			close_CHAT_LIST_CONT();
			open_CHAT_BODY_CONT();
			//UNCHECKED_MSG_COUNT 값과
			//CHAT_OT*_VD uncheckedmsg 값 갱신
			//대충 UNCHECKED_MSG_COUNT -= uncheckedmsg를 해준다
			UNCHECKED_MSG_COUNT -= targetInfo.uncheckedmsg;
			for(let key in (targetID === "otoele" ? CHAT_OTO_VD : CHAT_OTM_VD)) {
				if((targetID === "otoele" ? CHAT_OTO_VD : CHAT_OTM_VD)[key].eleId === targetEleId) {
					(targetID === "otoele" ? CHAT_OTO_VD : CHAT_OTM_VD)[key].dataObj.uncheckedmsg = 0;
					break;
				}
			}
			//채팅방 목록 DOM 갱신
			printChatList();
			if(CHAT_BODY_INFO.isEmpty == false) {
				scrollIntoLastChatElement();
			}
			/*미확인 채팅값 갱신 DOM에 적용*/

			/*스크롤 감지 허용*/
			isChatLoadProcessDone = true;
		} catch(err) {
			//채팅방 로딩 실패 출력
			/*
				각 페이즈? 별 페이지들을 열어주는 함수들이 있으면 좋을듯?
				막 지금 chatListFooterBtnClick()이 하는걸
				거 안에 classList 만지는 부분을 각각 독립시키면 좀 편할거같음
			*/
			//임시
			window.alert("채팅방 로딩을 실패했습니다");
			console.log(err);
		}
	}
}

//채팅창 나가기 버튼 클릭
/*
	웹소켓 연결을 끊는 것은 SharedWorker가 맡음
	여기서 결정하지 않음
*/
async function chatBodyQuitBtnClick(e) {
	//스크롤 감지 금지
	isChatLoadProcessDone = false;

	//SharedWorker에게 요청
	WORKER.port.postMessage({
		action: "chatRoomLeave",
		payload: {
			roomidx: CHAT_BODY_INFO.roomidx
		}
	});

	//응답 대기/처리
	try {
		const res = await promised_waitTillResponse("chatRoomLeave");
		//모달 구성
		resetChatBodyInfo();
		//임시
		CHAT_BODY_CONT.classList.add("cc-hidden");
		CHAT_LIST_CONT.classList.remove("cc-hidden");
	} catch(err) {
		//채팅방 이탈 실패 출력
		//임시
		window.alert("채팅방 나가기를 실패했습니다");
		console.log(err);

		//스크롤 감지 롤백
		isChatLoadProcessDone = true;
	}
}

//채팅 나가기(탈퇴) 버튼 클릭
/*
	현재 열려있는 채팅에서 나가게(cu.chat_user_is_quit=true) 요청을 보내는 함수
*/
function leaveChatBtnClick(e) {
	//스크롤 감지 금지
	isChatLoadProcessDone = false;

	
}

//채팅 종료하기 버튼 클릭
/*
	현재 열려있는 채팅을 종료(cr.chat_room_is_terminated=true)시키는 요청을 보내는 함수
	채팅 종료는 영구적임 - 되돌릴 수 없음
	사실 되돌리려면 되돌릴 수는 있음 있는데 내가 그거까지 짜기는 시간도없고 뭐

	하여간
	클라단에서의 채팅 종료는 오로지 가이드에 의해서만, 그리고 해당 가이드가 소유한 패키지의 채팅에서만 실행될 수 있어야 함
	따라서 이 메서드는 오로지 guidenum을 꺼내올 수 있으며 CHAT_BODY_INFO.isPkgChat=true 일 때에만 노출되어야 함
	뭐 일단 서버단에서도 한번 걸러줄거긴 한데
	요청 userid가 해당 패키지 채팅의 소유자인지는 서버단에서 체크함
*/
function terminateChatBtnClick(e) {

}

//채팅창 입력 submit 클릭
/*
	입력 로직
	submit
	-> 우선 DOM에 채팅(로딩) 올리기
	-> 서버 찍턴
	-> 성공시 채팅(로딩)을 채팅으로 변경
		-> 실패시 채팅(로딩)을 채팅(실패)으로 변경
		-> UI로 버튼 2개 제공, resubmit, cancelsubmit 정도
			-> cancelsubmit 시 DOM서 삭제
			-> resubmit 시 서버찍턴 goto

	일단은 서버 찍턴 -> 성공/실패에 따라 처리 정도로만 함
*/
async function chatBodySubmitBtnClick(e) {
	const inputContent = CHAT_BODY_INPUT.value;

	if(inputContent != "") {
		/*여기서도 이전 채팅을 체크해서 ccbody-head를 붙여줄 지 판별해야 함*/
		printChatElement("loading", inputContent, "ccbody-right", "ccbody-loading");
		scrollIntoLastChatElement();

		WORKER.port.postMessage({
			action: "sendChat",
			payload: {
				roomidx: CHAT_BODY_INFO.roomidx,
				chatContent: inputContent
			}
		});

		//응답 대기/처리
		try {
			const res = await promised_waitTillResponse("sendChat");
			/*VD 조작 함수 호출*/
			/*DOM 구현 함수 호출*/
			// adjustChatElementClass("ccbodyele-loading", "ccbody-right");
			// adjustChatElementId("ccbodyele-loading", "ccbody-" + res.chatDetailIdx);
			console.log(res);
			sendChatReceiveHandler(res.payload);
			//채팅방 목록 갱신
			chatListControlForChatReceive(res.payload, false);
		} catch(e) {
			//오류 처리
			console.log(e);
		}

		//다 했으면 성공실패 상관없이 입력창 비우기
		CHAT_BODY_INPUT.value = "";
	} else {
		//공란 입력 불가능 알림
	}
}

//broadcastChat 수신기
/*
	채팅방이 닫혀있으면 팝업알림만,
	열려있으면 채팅방 갱신도

	두 경우 모두 채팅창이 열린 적이 있으면(CHAT_OT*_VD가 비어있지 않으면)
	UNCHECKED_MSG_COUNT--과 CHAT_OT*_VD.uncheckedmsg--를 해준다

	이거 좀 생각보다 복잡함

	대충 경우의 수
	*broadcastChat은 무조건 상대방 채팅*
	채팅창 열려있음
		마지막 채팅이
			없으면
				ccbody-date 삽입
				ccbody-head 부여
				CBI.isEmpty=false 할당
			내꺼
				ccbody-head 부여
				마지막 채팅 ccbody-timestamp 유지
				1일 이상 차이나면
					ccbody-date 삽입
			송신자와 다른 사람
				ccbody-head 부여
				마지막 채팅 ccbody-timestamp 유지
				1일 이상 차이나면
					ccbody-date 삽입
			송신자
				x
				마지막 채팅과 1분 이하 차이면
					마지막 채팅에서 ccbody-timestamp 제거
				1분 이상이면
					ccbody-head 부여
					ccbody-timestamp 유지
				1일 이상이면
					ccbody-head 부여
					ccbody-timestamp 유지
					ccbody-date 삽입
		CBI.lastSender 갱신
	채팅방목록 로드된 적이 있음
	채팅방목록 로드된 적이 없음

	UNCHECKED_MSG_COUNT, CHAT_OT*_VD[n].uncheckedmsg 처리는 handler에서
*/
function broadcastChatHandler(payload) {
	let unchkmsgFlag = false;

	if(!!CHAT_BODY_INFO.roomidx) {
		//채팅방이 열려있을때
		createBroadcastChatElement(payload);
		scrollIntoLastChatElement();
	} else {
		//채팅방이 닫혀있을떄
		/*UNCHECKED_MSG_COUNT는 VD 구현 시점에서 초기화*/
		unchkmsgFlag = true;
		/*알림 띄우기*/
		createBroadcastChatAlertElement(payload);
	}

	//공통 처리(채팅리스트에서 수신 채팅방 최상위로 올리기 등)
	chatListControlForChatReceive(payload, unchkmsgFlag);
}

//broadcastChat 채팅방 요소 처리
function createBroadcastChatElement(payload) {
	//플래그
	let dateFlag = false;
	let headFlag = false;
	let timestampRemoveFlag = false;


	//시간 비교값
	/*broadcastChat *상대적 미래**/
	const timestamp = new Date(payload.regdate);
	/*기존 채팅 *상대적 과거*/
	const tgtstamp = new Date(CHAT_BODY_MORE_INNER_CONT.lastChild.dataset.fulltimestamp);

	//플래그 설정
	if(CHAT_BODY_INFO.isEmpty) {
		//이전 채팅이 없는 경우
		dateFlag = true;
		headFlag = true;
		CHAT_BODY_INFO.isEmpty = false;
	} else {
		//이전 채팅이 있는 경우
		if(CHAT_BODY_INFO.lastSender === CHAT_BODY_INFO.userid) {
			//사용자 채팅이 마지막
			headFlag = true;
		} else if(CHAT_BODY_INFO.lastSender === payload.userid) {
			//송신자 채팅이 마지막
			//ccbody-timestamp 유지 체크
			if(getDiffOfMinuteByDateObject(timestamp, tgtstamp) == 0) {
				timestampRemoveFlag = true;
			} else {
				headFlag = true;
			}
		} else {
			//그외 사용자 채팅이 마지막
			headFlag = true;
		}

		//ccbody-date 체크
		if((timestamp.getFullYear() == tgtstamp.getFullYear() && getDiffOfDate(tgtstamp.getTime(), timestamp.getTime()) < 0) || timestamp.getFullYear() > tgtstamp.getFullYear()) {
			dateFlag = true;
		}
	}

	console.log("createBroadcastChatElement() dateFlag=" + dateFlag + " headFlag=" + headFlag + " tsRemoveFlag=" + timestampRemoveFlag);

	//DOM 구현
	/*기존 채팅 timestamp 제거*/
	if(timestampRemoveFlag) {
		CHAT_BODY_MORE_INNER_CONT.lastChild.classList.remove("ccbody-timestamp");
	}
	/*날짜 블럭(ccbody-date) 삽입*/
	if(dateFlag) {
		const dateDiv = document.createElement("div");
		dateDiv.classList.add("ccbody-date");
		dateDiv.innerHTML = timestamp.getFullYear() + "년 "
						+ (timestamp.getMonth() + 1) + "월 "
						+ timestamp.getDate() + "일 "
						+ CHAT_DAY_ARR[timestamp.getDay()] + "요일 ";
		CHAT_BODY_MORE_INNER_CONT.appendChild(dateDiv);
	}
	/*메시지 블럭 생성, 추가*/
	const lastChat = document.createElement("div");
	lastChat.id = "ccbodyele-" + payload.chatDetailIdx;
	lastChat.classList.add("ccbody-left");
	lastChat.classList.add("ccbody-timestamp");
	lastChat.dataset.timestamp = timestamp.getHours() 
							+ ":" 
							+ (timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes()
															: timestamp.getMinutes());
	lastChat.dataset.fulltimestamp = payload.regdate;
	if(headFlag) {
		lastChat.classList.add("ccbody-head");
		const imgDiv = document.createElement("div");
		const useridDiv = document.createElement("div");
		/*임시 이미지 삽입*/
		imgDiv.style.backgroundImage = "url('" + "/images/layoutimg/logo.png" + "')";
		/*이미지 존재시 삽입*/
		for(let ui of CHAT_BODY_INFO.chatRoomInfo.userImage) {
			if(payload.userid == ui.userid) {
				imgDiv.style.backgroundImage = "url('" + "/user/thumbnail?sysname=" + ui.sysname + "')";
				break;
			}
		}
		/*userid 삽입*/
		useridDiv.innerHTML = payload.userid;
		lastChat.appendChild(imgDiv);
		lastChat.appendChild(useridDiv);
	}
	const p = document.createElement("p");
	p.innerHTML = payload.chatContent;
	lastChat.appendChild(p);
	CHAT_BODY_MORE_INNER_CONT.appendChild(lastChat);

	/*CBI.lastSender 갱신*/
	CHAT_BODY_INFO.lastSender = payload.userid;
}

//broadcastChat 미확인 채팅 알림처리
function createBroadcastChatAlertElement(payload) {
	const div = document.createElement("div");
	div.classList.add("cc-alert");
	const h4 = document.createElement("h4");
	h4.innerHTML = payload.userid;
	div.appendChild(h4);
	const p = document.createElement("p");
	p.innerHTML = payload.chatContent;
	div.appendChild(p);
	CHAT_ALERT_CONT.appendChild(div);
	setTimeout(() => div.remove(), 5000);
}
// function broadcastChatHandler(data) {
// 	if(!!CHAT_BODY_INFO.roomidx) {
// 		//채팅창이 열려있을 때
// 		printChatElement(data.payload.chatDetailIdx, data.payload.chatContent, "ccbody-left");
// 		scrollIntoLastChatElement();
// 	} else {
// 		//채팅창이 닫혀있을 때
// 		UNCHECKED_MSG_COUNT++;
// 		let chk = true;

// 		for(let i = 0; i < CHAT_OTO_VD.length; i++) {
// 			if(CHAT_OTO_VD[i].dataObj.roomidx === data.payload.roomidx) {
// 				CHAT_OTO_VD[i].dataObj.uncheckedmsg++;
// 				chk = false;
// 				break;
// 			}
// 		}
// 		if(chk) {
// 			for(let i = 0; i < CHAT_OTM_VD.length; i++) {
// 				if(CHAT_OTM_VD[i].dataObj.roomidx === data.payload.roomidx) {
// 					CHAT_OTM_VD[i].dataObj.uncheckedmsg++;
// 					break;
// 				}
// 			}
// 		}

// 		/*미확인 체팅 알림처리*/
// 		console.log("미확인 채팅 알림처리");

// 		const div = document.createElement("div");
// 		div.classList.add("cc-alert");
// 		const h4 = document.createElement("h4");
// 		h4.innerHTML = data.payload.userid;
// 		div.appendChild(h4);
// 		const p = document.createElement("p");
// 		p.innerHTML = data.payload.chatContent;
// 		div.appendChild(p);
// 		CHAT_ALERT_CONT.appendChild(div);
// 		console.log(div);
// 		setTimeout(() => {
// 			div.remove();
// 			console.log("div removed");
// 		}, 3000);
// 	}
// }
//sendChat 수신 처리 함수
/*
	대충 해야하는거
	이전 채팅 확인, sendChat 채팅에 ccbody-head 부여 결정, ccbody-date 삽입 결정
		ccbody-head
			이전 채팅이 있는 경우
				이전 채팅이 상대 채팅인 경우 ccbody-head 부여
				이전 채팅이 내 채팅인 경우
					이전 메시지와 1분 초과 차이가 나는 경우 ccbody-head 추가
					1분 이내 차이인 경우 추가하지 않음
			이전 채팅이 없는 경우
				ccbody-head 부여
		ccbody-date
			이전 채팅이 있는 경우
				*송신자 상관없이* 이전 채팅과 1일 이상 차이가 나는 경우 ccbody-date 삽입
				1일 이하면 삽입하지 않음
			이전 채팅이 없는 경우
				ccbody-date 삽입
	id 수정
		ㅇㅇ
	ccbody-loading 제거
		dd
	이전 채팅에서 ccbody-timestamp 제거
		상대 채팅인 경우 지우지 않는다
		내 채팅이여도 1분 초과 차이인 경우 지우지 않는다
	ccbody-timestamp 부여
		dd
	data-timestamp 속성 부여
		dd
	data-fulltimestamp 속성 부여
		ㅇㅇ
	CHAT_BODY_INFO 수정
		isEmpty -> false(true였으면)

	!!중요한거는 sendChat는 요소를 새로 만드는게 아니라 submit시 생성된 .ccbody-loading 요소를 가져다 쓴다는거임
	
	얘네들은 여기 말고 위에서 할 수도 있음
	UNCHECKED_MSG_COUNT 갱신
	CHAT_OT*_VD[n].uncheckedmsg 갱신
*/
function sendChatReceiveHandler(payload) {
	let dateFlag = false;
	let headFlag = false;
	let timestampRemoveFlag = false;

	/*CBI.lastSender 초기화*/
	CHAT_BODY_INFO.lastSender = CHAT_BODY_INFO.userid;

	//시간 비교용
	//sendChat *상대적 미래*
	const timestamp = new Date(payload.regdate);
	//기존 채팅 *상대적 과거*
	const tgtstamp = new Date(CHAT_BODY_MORE_INNER_CONT.lastChild.previousSibling.dataset.fulltimestamp);

	if(CHAT_BODY_INFO.isEmpty) {
		//이전 채팅이 없는 경우
		//ccbody-date 삽입, sendChat .ccbody-head 부여, CBI.isEmpty=false 할당
		dateFlag = true;
		headFlag = true;
		CHAT_BODY_INFO.isEmpty = false;
	} else {
		//이전 채팅이 있는 경우
		if(CHAT_BODY_MORE_INNER_CONT.lastChild.previousSibling.classList.contains("ccbody-left")) {
			//이전 채팅이 있으며 상대 채팅인 경우
			headFlag = true;
		} else {
			//이전 채팅이 있으며 내 채팅인 경우
			if(getDiffOfMinuteByDateObject(tgtstamp, timestamp) < 0) {
				//1분 이상 차이나는 경우
				headFlag = true;
			} else {
				//1분 이하 차이
				timestampRemoveFlag = true;
			}
		}
		if((timestamp.getFullYear() == tgtstamp.getFullYear() && getDiffOfDate(tgtstamp.getTime(), timestamp.getTime()) < 0) || timestamp.getFullYear() > tgtstamp.getFullYear()) {
			//1일 이상 차이나는 경우
			dateFlag = true;
		}
	}
	
	console.log("dateFlag=" + dateFlag + " headFlag=" + headFlag + " timestampRemoveFlag=" + timestampRemoveFlag);

	//DOM 구현
	//1분 미만 차이나는 내 채팅의 ccbody-timestamp 제거
	if(timestampRemoveFlag) {
		CHAT_BODY_MORE_INNER_CONT.lastChild.previousSibling.classList.remove("ccbody-timestamp");
	}
	if(dateFlag) {
		//ccbody-date(날짜 블럭) 삽입
		const dateDiv = document.createElement("div");
		dateDiv.classList.add("ccbody-date");
		dateDiv.innerHTML = timestamp.getFullYear() + "년 "
						+ (timestamp.getMonth() + 1) + "월 "
						+ timestamp.getDate() + "일 "
						+ CHAT_DAY_ARR[timestamp.getDay()] + "요일";
		CHAT_BODY_MORE_INNER_CONT.lastChild.before(dateDiv);
	}
	//메시지 본문 구성
	const lastChat = CHAT_BODY_MORE_INNER_CONT.lastChild;
	lastChat.id = "ccbodyele-" + payload.chatDetailIdx;
	lastChat.classList.remove("ccbody-loading");
	if(headFlag)
		lastChat.classList.add("ccbody-head");
	lastChat.dataset.timestamp = new Date(payload.regdate).getHours() + ":" + (new Date(payload.regdate).getMinutes() < 10 ? "0" + new Date(payload.regdate).getMinutes() : new Date(payload.regdate).getMinutes());
	lastChat.dataset.fulltimestamp = payload.regdate;
	lastChat.classList.add("ccbody-timestamp");
}

//스크롤 감지 허용 전역변수
/*위치 바꿔라*/
let isChatLoadProcessDone = false;

//스크롤 감지기(로딩)
/*
	스크롤 지연시간 넣기?
	넣는다면 chat_test05.html 참조
*/
async function chatRoomScrollEventReceiver(e) {
	console.log("cRSER CBIC.scrollTop=" + CHAT_BODY_INNER_CONT.scrollTop);
	if(CHAT_BODY_INFO.isEmpty === false && CHAT_BODY_INFO.isFirst === false) {
		if(CHAT_BODY_INNER_CONT.scrollTop / CHAT_BODY_INNER_CONT.offsetHeight <= 0.05) {
			if(isChatLoadProcessDone) {
				isChatLoadProcessDone = false;

				WORKER.port.postMessage({
					action: "loadChat",
					payload: {
						roomidx: CHAT_BODY_INFO.roomidx,
						startChatDetailIdx: CHAT_BODY_INFO.firstDetailIdx
					}
				});

				try {
					const res = await promised_waitTillResponse("loadChat", 1000);

					console.log(res);
					/*DOM 구현 함수 호출*/
					chatLoadHandler(res.payload);
					/*모든 과정 완료 후 스크롤 로딩 허용*/
					isChatLoadProcessDone = true;
				} catch(err) {
					console.error(err);
					console.log(err);

					isChatLoadProcessDone = true;
				}
			}
		}
	}
}

function chatLoadHandler(payload) {
	//CBI 갱신
	CHAT_BODY_INFO.isFirst = payload.isFirst;
	CHAT_BODY_INFO.firstDetailIdx = payload.startChatDetailIdx;

	//DOM 구현
	/*
		인덱스 0 ~ length-1 순으로 순회
		실제 구현은 최신순부터 내림차순
		즉 가져온 리스트의 최신부터 기존 채팅 위에 appendChild를 한다

		완료 후 CBI.firstDetailIdx를 payload.startDetailIdx로 초기화

		payload.isFirst 가 true면
		chatDetails 삽입 완료 후 날짜 블럭(ccbody-date)과 시작 블럭(ccbody-start)를 삽입
		CBI.isFirst를 true로 갱신한다
	*/

	//chatFragment
	const chatFragment = document.createDocumentFragment();

	for(let i in payload.chatDetails) {
		//플래그
		/*날짜블럭(ccbody-date) 삽입 구분*/
		let dateFlag = false;
		/*채팅 좌우 구분*/
		let isLeftFlag = false;
		/*채팅 타임스탬프 여부*/
		let isTimestamp = false;
		/*기존요소 ccbody-head 제거(i==0) 혹은 기존요소 ccbody-head 미부여(i > 0) 여부*/
		let doesHeadNeedToUnexist = false;

		/*기존 채팅과 이을지 여부*/
		let isChatContinued = false;

		//현재 요소
		const cdDTO = payload.chatDetails[i];
		//현재 요소 시간
		const reg = new Date(cdDTO.regdate);

		//ccbody-left/right 판별
		if(cdDTO.userid != CHAT_BODY_INFO.userid) {
			isLeftFlag = true;
		}

		//기존 채팅과 이을지 판별 - 이전 채팅 ccbody-head 유지/제거-부여/미부여, 타겟 채팅 ccbody-timestamp 부여 여부
		//날짜블럭 체크
		if(i == 0) {
			//로드된 채팅중 첫 번째는 마지막 기존 채팅과 비교
			if(
				(isLeftFlag && CHAT_BODY_MORE_INNER_CONT.firstChild.classList.contains("ccbody-left")) 
				||
				(!isLeftFlag && CHAT_BODY_MORE_INNER_CONT.firstChild.classList.contains("ccbody-right"))
			) {
				if(getDiffOfMinuteByDateObject(reg, new Date(CHAT_BODY_MORE_INNER_CONT.firstChild.dataset.fulltimestamp)) == 0) {
					doesHeadNeedToUnexist = true;
				}
			}
			if(
				getDiffOfDate(reg.getTime(), (new Date(CHAT_BODY_MORE_INNER_CONT.firstChild.dataset.fulltimestamp)).getTime()) < 0
			) {
				dateFlag = true;
			}
		} else {
			//나머지는 chatFragment 요소와 비교
			if(
				(isLeftFlag && chatFragment.firstChild.classList.contains("ccbody-left"))
				||
				(!isLeftFlag && chatFragment.firstChild.classList.contains("ccbody-right"))
			) {
				if(getDiffOfMinuteByDateObject(reg, new Date(chatFragment.firstChild.dataset.fulltimestamp)) == 0) {
					doesHeadNeedToUnexist = true;
				}
			}
			if(
				getDiffOfDate(reg.getTime(), (new Date(chatFragment.firstChild.dataset.fulltimestamp)).getTime()) < 0
			) {
				dateFlag = true;
			}
		}

		//구현

		const div = document.createElement("div");
		div.id = "ccbodyele-" + cdDTO.chatDetailIdx;
		div.classList.add(isLeftFlag ? "ccbody-left" : "ccbody-right");
		div.dataset.timestamp = reg.getHours() + ":" 
											+ (reg.getMinutes() < 10 ? "0" + reg.getMinutes()
																	: reg.getMinutes());
		div.dataset.fulltimestamp = cdDTO.regdate;
		const p = document.createElement("p");
		p.innerHTML = cdDTO.chatDetailContent;
		div.appendChild(p);

		if(i == 0 && doesHeadNeedToUnexist) {
			if(CHAT_BODY_MORE_INNER_CONT.firstChild.classList.contains("ccbody-left")) {
				CHAT_BODY_MORE_INNER_CONT.firstChild.firstChild.remove();
				CHAT_BODY_MORE_INNER_CONT.firstChild.firstChild.remove();
			}
			CHAT_BODY_MORE_INNER_CONT.firstChild.classList.remove("ccbody-head");
		}
		else if(i == 0) {
			div.classList.add("ccbody-timestamp");
		}
		if(i > 0 && !doesHeadNeedToUnexist) {
			chatFragment.firstChild.classList.add("ccbody-head");
			if(chatFragment.firstChild.classList.contains("ccbody-left")) {
				const imgDiv = document.createElement("div");
				imgDiv.style.backgroundImage = "url('" + "/images/layoutimg/logo.png" + "')";
				for(let ui of CHAT_BODY_INFO.chatRoomInfo.userImage) {
					if(payload.chatDetails[i-1].userid == ui.userid) {
						imgDiv.style.backgroundImage = "url('" + "/user/thumbnail?sysname=" + ui.sysname + "')";
						break;
					}
				}
				const useridDiv = document.createElement("div");
				useridDiv.innerHTML = payload.chatDetails[i-1].userid;

				chatFragment.firstChild.prepend(useridDiv);
				chatFragment.firstChild.prepend(imgDiv);
			}

			div.classList.add("ccbody-timestamp");
		}

		console.log(cdDTO.chatDetailIdx);
		console.log(dateFlag);

		if(dateFlag) {
			console.log("dateFlag=true");
			const tgtDate = new Date(
				i == 0 ? new Date(CHAT_BODY_MORE_INNER_CONT.firstChild.dataset.fulltimestamp)
						: new Date(chatFragment.firstChild.dataset.fulltimestamp)
			);
			const dateDiv = document.createElement("div");
			dateDiv.classList.add("ccbody-date");
			dateDiv.innerHTML = tgtDate.getFullYear() + "년 " 
							+ (tgtDate.getMonth() + 1) + "월 "
							+ tgtDate.getDate() + "일 "
							+ CHAT_DAY_ARR[tgtDate.getDay()] + "요일";
			console.log(dateDiv);
			chatFragment.prepend(dateDiv);
		}

		chatFragment.prepend(div);

	}

	//마지막으로 만들어진 요소가 ccbody-left면 ccbody-head를 붙여준다
	if(chatFragment.firstChild.classList.contains("ccbody-left")) {
		chatFragment.firstChild.classList.add("ccbody-head");
		const imgDiv = document.createElement("div");
		imgDiv.style.backgroundImage = "url('" + "/images/layoutimg/logo.png" + "')";
		for(let ui of CHAT_BODY_INFO.chatRoomInfo.userImage) {
			if(payload.chatDetails[payload.chatDetails.length-1].userid == ui.userid) {
				imgDiv.style.backgroundImage = "url('" + "/user/thumbnail?sysname=" + ui.sysname + "')";
				break;
			}
		}
		const useridDiv = document.createElement("div");
		useridDiv.innerHTML = payload.chatDetails[payload.chatDetails.length-1].userid;

		chatFragment.firstChild.prepend(useridDiv);
		chatFragment.firstChild.prepend(imgDiv);
	}

	//채팅방의 모든 채팅이 로드되었으면 시작메시지블럭과 날짜블럭을 삽입
	if(CHAT_BODY_INFO.isFirst) {
		const tgtDate = new Date(new Date(chatFragment.firstChild.dataset.fulltimestamp));
		const dateDiv = document.createElement("div");
		dateDiv.classList.add("ccbody-date");
		dateDiv.innerHTML = tgtDate.getFullYear() + "년 " 
						+ (tgtDate.getMonth() + 1) + "월 "
						+ tgtDate.getDate() + "일 "
						+ CHAT_DAY_ARR[tgtDate.getDay()] + "요일";

		chatFragment.prepend(dateDiv);

		const startDiv = document.createElement("div");
		startDiv.classList.add("ccbody-start");
		const startP = document.createElement("p");
		startP.innerHTML = "채팅방이 시작되었습니다.";
		startDiv.appendChild(startP);

		chatFragment.prepend(startDiv);
	}

	//채팅방에 적용
	CHAT_BODY_MORE_INNER_CONT.prepend(chatFragment);
}

/*================================================================================*/
/*연결*/
//비동기 응답 대기
async function promised_waitTillResponse(action, millisec = 3000) {
	return new Promise((resolve, reject) => {
		const receiver = (e) => {
			if(e.data.action === action) {
				if(e.data.isSuccess === true) {
					resolve(e.data);
				} else {
					reject(new Error("reportFromWorker"));
				}
				WORKER.port.removeEventListener("message", receiver);
				clearTimeout(timeoutId);
			}
		};

		const timeoutId = setTimeout(() => {
			console.log("promised_waitTillResponse timeout call");
			if(!!WORKER)
				WORKER.removeEventListener("message", receiver);
			reject(new Error("timeout"));
		}, millisec);
		WORKER.port.addEventListener("message", receiver);
	});
}

/*================================================================================*/
/*VD 처리/데이터 처리*/

//채팅방 VD 정리
/*
	정렬 기준은 regdate
	최초 로드인 경우 key값 i를 0으로, 그 외의 경우 CHAT_ROOM_CNT를 기준으로 함

	240603
	이제 한번에 모든 채팅을 불러오는 구조로 바뀜
	+ 일대일 일대다 출력 별개로

	따라서 VD를 나눌 필요가 있겠음

	+ VD 목적
	거창한 가상돔 그런거보다는
	채팅방 정보를 HTML에 저장하는 구조가 좀 그런게 크다
	채팅방 정보를 저장하는 목적

	VD 구성
	은 배열로 한다
	생각해보니까 key-value면 정렬할때 좆됨

	!!!!!!!중요
	채팅방 ID는 정렬 순서가 아니라 roomidx로 준다
*/

//채팅 로드 여부 체크
/*
	가입한 채팅방 개수와 관련 없이
	VD가 로드된 적이 있는지(채팅창을 연 적이 있는지)를 체크
*/
let IS_VD_LOADED = false;

//일대일 VD
let CHAT_OTO_VD = [];
//일대다 VD
let CHAT_OTM_VD = [];
//채팅방 저장객체 생성자
function ChatRoom(eleId, dataObj) {
	this.eleId = eleId;
	this.dataObj = dataObj;
}
//총 안 읽은 개수
let UNCHECKED_MSG_COUNT = 0;

let CHAT_FIRST_DETAIL_IDX = null;

const CHAT_BODY_INFO = {
	roomidx: null,
	isEmpty: false,
	firstDetailIdx: null,
	isFirst: null,
	userid: null,
	isPkgChat: null,
	isOTO: null,
	lastSender: null,
	chatRoomInfo: null
};

//VD 처리
//VD 초기화
/*
	!!중요 - "초기화"임 기존 요소들이랑 미확인카운팅값 날린다
*/
function setChatListVD(data) {
	//기존값 초기화
	CHAT_OTO_VD = [];
	CHAT_OTM_VD = [];
	UNCHECKED_MSG_COUNT = 0;

	//data의 userList.length가 1인지 1 이상인지 체크, oto과 otm을 나눈다
	for(let clObj of data) {
		if(clObj.userList.length == 1) {
			//oto
			CHAT_OTO_VD.push(new ChatRoom("otoele-" + clObj.roomidx, clObj));
		} else {
			//otm
			CHAT_OTM_VD.push(new ChatRoom("otmele-" + clObj.roomidx, clObj));
		}
	}
}
//VD 업데이트
function updateChatListVD(data) {
	//data가 존재하는지 확인, 존재하면 순서를 바꾸고 없으면 제일 최상위에 삽입
}
function insertChatListVD(data) {
	//ChatListPayloadDTO 객체 하나를 VD 최상위에 삽입
	if(data.userList.length == 1) {
		//oto
		CHAT_OTO_VD.unshift(new ChatRoom("otoele-" + data.roomidx, data));
	} else {
		//otm
		CHAT_OTM_VD.unshift(new ChatRoom("otoele-" + data.roomidx, data));
	}
}

//sendChat, broadcastChat 시 채팅방 리스트 VD 컨트롤
function chatListControlForChatReceive(payload, unchkmsgFlag) {
	let isOTO = false;
	let i = 0;

	//찾기
	for(; i < CHAT_OTO_VD.length; i++) {
		if(CHAT_OTO_VD[i].dataObj.roomidx === payload.roomidx) {
			if(unchkmsgFlag) {
				CHAT_OTO_VD[i].dataObj.uncheckedmsg++;
			}
			isOTO = true;
			break;
		}
	}
	if(!isOTO) {
		for(i = 0; i < CHAT_OTM_VD.length; i++) {
			if(CHAT_OTM_VD[i].dataObj.roomidx === payload.roomidx) {
				if(unchkmsgFlag) {
					CHAT_OTM_VD[i].dataObj.uncheckedmsg++;
				}
				break;
			}
		}
	}

	console.log("cc=" + payload.chatContent + " ccr=" + payload.chatContentRegdate);
	console.log("i=" + i);

	//VD 조작
	if(isOTO) {
		CHAT_OTO_VD.unshift(CHAT_OTO_VD.splice(i, 1)[0]);
		CHAT_OTO_VD[0].dataObj.chatContent = payload.chatContent;
		CHAT_OTO_VD[0].dataObj.chatContentRegdate = payload.regdate;
	} else {
		CHAT_OTM_VD.unshift(CHAT_OTM_VD.splice(i, 1)[0]);
		CHAT_OTM_VD[0].dataObj.chatContent = payload.chatContent;
		CHAT_OTM_VD[0].dataObj.chatContentRegdate = payload.regdate;
	}

	console.log("VD control done");

	//VD 구현 호출
	printChatList();
}

//CHAT_BODY_INFO 세팅
/*
	payload 부분만 인수로 넣을것
*/
function setChatBodyInfo(payload) {
	if(!payload.startChatDetailIdx && !payload.endChatDetailIdx) {
		CHAT_BODY_INFO.isEmpty = true;
		CHAT_BODY_INFO.firstDetailIdx = null;
		CHAT_BODY_INFO.isFirst = null;
		CHAT_BODY_INFO.lastSender = null;
	} else {
		CHAT_BODY_INFO.isEmpty = false;
		CHAT_BODY_INFO.firstDetailIdx = payload.startChatDetailIdx;
		CHAT_BODY_INFO.isFirst = payload.isFirst;
		CHAT_BODY_INFO.lastSender = payload.chatDetails[0].userid;
	}
	CHAT_BODY_INFO.roomidx = payload.roomidx;
	CHAT_BODY_INFO.userid = payload.requestUserid;

	let chk = true;

	for(let temp of CHAT_OTO_VD) {
		if(temp.dataObj.roomidx === payload.roomidx) {
			CHAT_BODY_INFO.isPkgChat = !!temp.dataObj.pkgnum;
			CHAT_BODY_INFO.isOTO = true;
			CHAT_BODY_INFO.chatRoomInfo = temp.dataObj;
			chk = false;
			break;
		}
	}
	if(chk) {
		for(let temp of CHAT_OTM_VD) {
			if(temp.dataObj.roomidx === payload.roomidx) {
				CHAT_BODY_INFO.isPkgChat = !!temp.dataObj.pkgnum;
				CHAT_BODY_INFO.isOTO = false;
				CHAT_BODY_INFO.chatRoomInfo = temp.dataObj;
				break;
			}
		}
	}
}
//CHAT_BODY_INFO 초기화
function resetChatBodyInfo() {
	CHAT_BODY_INFO.roomidx = null;
	CHAT_BODY_INFO.isEmpty = false;
	CHAT_BODY_INFO.firstDetailIdx = null;
	CHAT_BODY_INFO.isFirst = null;
	CHAT_BODY_INFO.userid = null;
	CHAT_BODY_INFO.isPkgChat = null;
	CHAT_BODY_INFO.isOTO = null;
	CHAT_BODY_INFO.lastSender = null;
	CHAT_BODY_INFO.chatRoomInfo = null;
}

/*================================================================================*/
/*cc-hidden 컨트롤*/
//채팅 컨텍스트
function open_CHAT_WINDOW() { CHAT_WINDOW.classList.remove("cc-hidden"); }
function close_CHAT_WINDOW() { CHAT_WINDOW.classList.add("cc-hidden"); }
//채팅방 목록창
function open_CHAT_LIST_CONT() { CHAT_LIST_CONT.classList.remove("cc-hidden"); }
function close_CHAT_LIST_CONT() { CHAT_LIST_CONT.classList.add("cc-hidden"); }
//채팅방 목록
function open_CHAT_LIST_OTO() {
	if(CHAT_OTO_VD.length > 0) {
		CHAT_LIST_OTO.classList.remove("cc-hidden");
		CHAT_LIST_OTM.classList.add("cc-hidden");
		CHAT_LIST_EMPTY.classList.add("cc-hidden");
	} else {
		CHAT_LIST_EMPTY.classList.remove("cc-hidden");
		CHAT_LIST_OTO.classList.add("cc-hidden");
		CHAT_LIST_OTM.classList.add("cc-hidden");
	}
}
function open_CHAT_LIST_OTM() {
	if(CHAT_OTM_VD.length > 0) {
		CHAT_LIST_OTM.classList.remove("cc-hidden");
		CHAT_LIST_OTO.classList.add("cc-hidden");
		CHAT_LIST_EMPTY.classList.add("cc-hidden");
	} else {
		CHAT_LIST_EMPTY.classList.remove("cc-hidden");
		CHAT_LIST_OTO.classList.add("cc-hidden");
		CHAT_LIST_OTM.classList.add("cc-hidden");
	}
}
//채팅창
function open_CHAT_BODY_CONT() { CHAT_BODY_CONT.classList.remove("cc-hidden"); }
function close_CHAT_BODY_CONT() { CHAT_BODY_CONT.classList.add("cc-hidden"); }
//채팅창 사이드바
function open_CHAT_BODY_SIDEBAR() { CHAT_BODY_SIDEBAR_BACKGROUND.classList.remove("cc-hidden"); }
function close_CHAT_BODY_SIDEBAR() { CHAT_BODY_SIDEBAR_BACKGROUND.classList.add("cc-hidden"); }

/*================================================================================*/
/*DOM 구현*/

//채팅창 요소 구현
//메시지(로딩)
function printChatElement(idValue, chatContent, ...classList) {
	const div = document.createElement("div");
	div.id = "ccbodyele-" + idValue;
	if(classList.length > 0) {
		classList.forEach((cls) => {
			div.classList.add(cls);
		});
	}
	const p = document.createElement("p");
	p.innerHTML = chatContent;
	div.appendChild(p);
	CHAT_BODY_MORE_INNER_CONT.appendChild(div);
}
//특정 메시지 클래스 수정
/*
	매개변수 classList[]의 값으로 덮어씌움
*/
function adjustChatElementClass(idValue, ...classList) {
	const target = document.getElementById(idValue);
	target.removeAttribute("class");
	if(classList.length > 0)
		classList.forEach((cls) => {
			target.classList.add(cls);
		});
}
//특정 메시지 id 수정
/*
	수정된 id를 반환
*/
function adjustChatElementId(oldIdValue, newIdValue) {
	document.getElementById(oldIdValue).id = newIdValue;
	return newIdValue;
}

//마지막 요소 포커스
function scrollIntoLastChatElement() {
	/*
	CHAT_BODY_MORE_INNER_CONT.lastChild.scrollIntoView({
		behavior: "instant",
		block: "end"
	});*/
	/*scrollBy(x, y) 의 y 값은 ccbody-timestamp의 마진바텀과 동일해야 함*/
	/*CHAT_BODY_MORE_INNER_CONT.scrollBy({
		top: 8,
		behavior: "instant"
	});*/
	CHAT_BODY_INNER_CONT.scrollBy({
		top: CHAT_BODY_MORE_INNER_CONT.offsetHeight,
		behavior: "instant"
	});
}

//채팅창 DOM 구현
/*
	처음 채팅창 로드시 한번만 실행

	일단 지금은 메시지 좌우 구분, id/class 부여와 내부 본문 출력까지만 함
*/
function printChatRoom(payload) {
	//기존 채팅 초기화
	CHAT_BODY_MORE_INNER_CONT.replaceChildren();
	/*CHAT_FIRST_DETAIL_IDX는 사용 안함 - CHAT_BODY_INFO에 이미 동일한 필드가 존재*/

	/*
		채팅창 화면 변경은 이 함수를 호출하는 함수(chatListOTNElementClick(), createPackageChat() 등)
		에서 처리함
	*/

	//채팅창 제목
	if(CHAT_BODY_INFO.isPkgChat) {
		//패키지채팅
		CHAT_BODY_TITLE.innerHTML = CHAT_BODY_INFO.chatRoomInfo.title;
	} else {
		//일반채팅
		if(!!CHAT_BODY_INFO.chatRoomInfo.title) {
			//방제 있음
			CHAT_BODY_TITLE.innerHTML = CHAT_BODY_INFO.chatRoomInfo.title;
		} else {
			//방제 없음
			//userid를 묶은 문자열 생성, 삽입
			let userids = "";
			for(let dto of CHAT_BODY_INFO.chatRoomInfo.userList) {
				userids += dto.userid + ", ";
			}
			userids = userids.slice(0, -2);
			CHAT_BODY_TITLE.innerHTML = userids;
		}
	}

	//채팅방에 채팅이 없으면(CHAT_BODY_INFO.isEmpty==true) 여기서 끝낸다
	if(CHAT_BODY_INFO.isEmpty) {
		//시작 메시지 삽입
		const startDiv = document.createElement("div");
		startDiv.classList.add("ccbody-start");
		const startP = document.createElement("p");
		startP.innerHTML = "채팅방이 시작되었습니다";
		startDiv.appendChild(startP);
		CHAT_BODY_MORE_INNER_CONT.appendChild(startDiv);
		return;
	}
	
	//fragment
	const chatFragment = document.createDocumentFragment();
	

	/*
		서버서 가져온 메시지는 regdate 내림차순 정렬이긴 한데
		위에서부터 채워나간다(배열 역순 - appendChild() 사용)
	*/

	for(let i = payload.chatDetails.length - 1; i > -1; i--) {
		const timestamp = new Date(payload.chatDetails[i].regdate);

		//채팅 컨테이너 생성, 초기화
		const div = document.createElement("div");
		div.id = "ccbodyele-" + payload.chatDetails[i].chatDetailIdx;
		div.dataset.timestamp = timestamp.getHours() + ":" + (timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes());
		div.dataset.fulltimestamp = payload.chatDetails[i].regdate;

		//ccbody-head, ccbody-timestamp 삽입 체크
		let headFlag = false;
		let timestampFlag = false;
		/*
			ccbody-head는 구현상 첫 메시지(i == payload.chatDetails.length - 1) 이거나
			이번 메시지의 송신자가 이전 메시지의 송신자와 다르거나
			이전 메시지와 분단위 이상의 차이가 날 때 삽입

			ccbody-timestamp는 다음 메시지가 없거나(i == 0)
			다음 메시지와 송신자가 다르거나
			두 채팅이 1분 이상 차이가 나는 경우 삽입
		*/
		if(
			i + 1 == payload.chatDetails.length 
			|| payload.chatDetails[i+1].userid != payload.chatDetails[i].userid 
			|| 0 < getDiffOfMinuteByDateObject(timestamp, new Date(payload.chatDetails[i+1].regdate))
		) {
			headFlag = true;
		}
		if(
			i == 0
			|| payload.chatDetails[i-1].userid != payload.chatDetails[i].userid
			|| 0 > getDiffOfMinuteByDateObject(timestamp, new Date(payload.chatDetails[i-1].regdate))
		) {
			timestampFlag = true;
		}

		//채팅 좌우 분기
		if(payload.chatDetails[i].userid != CHAT_BODY_INFO.userid) {
			//좌
			//기본 클래스 삽입
			div.classList.add("ccbody-left");
			//구현상 첫 메시지인 경우나 이전 메시지의 송신자가 다르거나 이전 메시지와 분단위 이상의 차이가 나면 ccbody-head 삽입
			if(headFlag) {
				div.classList.add("ccbody-head");
	
				//이미지
				const imgDiv = document.createElement("div");
				/*일단 임시로 로고 삽입*/
				imgDiv.style.backgroundImage = "url('" + "/images/layoutimg/logo.png" + "')";
				/*이미지 존재시 삽입*/
				for(let ui of CHAT_BODY_INFO.chatRoomInfo.userImage) {
					if(payload.chatDetails[i].userid == ui.userid) {
						imgDiv.style.backgroundImage = "url('" + "/user/thumbnail?sysname=" + ui.sysname + "')";
						break;
					}
				}
				
				//userid
				const useridDiv = document.createElement("div");
				useridDiv.innerHTML = payload.chatDetails[i].userid;
	
				div.appendChild(imgDiv);
				div.appendChild(useridDiv);
			}
		} else {
			//우
			//클래스 삽입
			div.classList.add("ccbody-right");
			//ccbody-head 삽입, 조건은 위와 같음
			//분단위 계산 로직 유지를 위한 객체
			if(headFlag) {
				div.classList.add("ccbody-head");
			}
		}

		//메시지 본문 삽입
		const p = document.createElement("p");
		p.innerHTML = payload.chatDetails[i].chatDetailContent;
		div.appendChild(p);

		//타임스탬프 클래스(.ccbody-timestamp) 삽입
		//다음 메시지가 없거나 송신자가 다르거나 분단위 이상 차이가 나면 삽입
		if(timestampFlag) {
			div.classList.add("ccbody-timestamp");
		}

		//chatFragment에 추가
		chatFragment.appendChild(div);

		//날짜 블럭(.ccbody-date) 삽입
		if(
			i > 0 && 
			(
				(
					timestamp.getFullYear() == new Date(payload.chatDetails[i-1].regdate).getFullYear() 
					&& 
					getDiffOfDate(timestamp.getTime(), new Date(payload.chatDetails[i-1].regdate).getTime()) < 0
				) 
				||
				(
					timestamp.getFullYear() < new Date(payload.chatDetails[i-1].regdate).getFullYear()
				)
			)
		) {
			//마지막 블럭이 아니면서 일 차이가 나는 경우 날짜 블럭 삽입
			const tgtDate = new Date(payload.chatDetails[i-1].regdate);

			const dateDiv = document.createElement("div");
			dateDiv.classList.add("ccbody-date");
			dateDiv.innerHTML = tgtDate.getFullYear() + "년 " 
							+ (tgtDate.getMonth() + 1) + "월 "
							+ tgtDate.getDate() + "일 "
							+ CHAT_DAY_ARR[tgtDate.getDay()] + "요일";
			
			//chatFragment에 삽입
			chatFragment.appendChild(dateDiv);
		}
	}

	//해당 채팅방의 마지막 로딩이면(CHAT_BODY_INFO.isFirst==true&&notnull) 상단에 시작메시지와 날짜블럭 삽입
	if(CHAT_BODY_INFO.isFirst) {
		const startDiv = document.createElement("div");
		startDiv.classList.add("ccbody-start");
		const startP = document.createElement("p");
		startP.innerHTML = "채팅방이 시작되었습니다";
		startDiv.appendChild(startP);
		const startDateDiv = document.createElement("div");
		startDateDiv.classList.add("ccbody-date");
		const startDateP = document.createElement("p");
		const tgtStartDate = new Date(payload.chatDetails[payload.chatDetails.length-1].regdate);
		startDateP.innerHTML = tgtStartDate.getFullYear() + "년 " 
							+ (tgtStartDate.getMonth() + 1) + "월 "
							+ tgtStartDate.getDate() + "일 "
							+ CHAT_DAY_ARR[tgtStartDate.getDay()] + "요일";
		startDateDiv.appendChild(startDateP);

		chatFragment.prepend(startDateDiv);
		chatFragment.prepend(startDiv);
	}

	//DOM에 추가
	CHAT_BODY_MORE_INNER_CONT.appendChild(chatFragment);
}

//날짜 차이 계산 메서드
//위치 바꿔라
/*
	년도가 차이나는 경우는 잡아주지 않음
	오로지 동일년도 + 다른 일자인 경우만 잡음

	인수는 Date.prototype.getTime()을 넣을 것
	
	결과값이 0이면 동일 날짜
	음수면 tgtTime이 하루 이상 미래
	양수면 tgtTime이 하루 이상 과거
*/
function getDiffOfDate(nowTime, afterTime) {
	const oneDay = 1000 * 60 * 60 * 24;
	const thisYear = new Date(new Date().getFullYear(), 0, 0).getTime();

	return Math.floor((nowTime - thisYear) / oneDay) - Math.floor((afterTime - thisYear) / oneDay);
}

//분단위 차이 계산 메서드
/**
 * 초 이하 단위를 생략한 시간 비교 함수
 * 
 * 반환값은 아래와 같음
 * @example
 *     nowDateObj : afterDateObj : 반환값
 *    .. 16:15:17 =  .. 16:15:53 :      0
 *    .. 16:15:17 <  .. 16:16:00 :     -1
 *    .. 16:15:17 >  .. 16:13:52 :      2
 * @param {Date} nowDateObj 현재 수정 요소의 시간값 Date 객체
 * @param {Date} afterDateObj 다음 수정 요소의 시간값 Date 객체
 * @returns {Number} 두 인수의 분 단위 차이
 */
function getDiffOfMinuteByDateObject(nowDateObj, afterDateObj) {
	const a = new Date(nowDateObj.getTime());
	const b = new Date(afterDateObj.getTime());

	a.setSeconds(0, 0);
	b.setSeconds(0, 0);

	return a.getTime() - b.getTime();
}

//채팅방 DOM 구현
//단순히 채팅창 목록에 요소를 채워넣기만 하는 메서드임 추가적인(cc-hidden 등)조작은 안함
//	다만 counterDiv(미확인 채팅 개수 출력)만은 cc-hidden 할당 체크함
//일단 임마는 채팅방 리스트가 닫혀 있어도(정확히는 채팅창이 열려 있어도) 작동하지는.. 않음
//해당 페이지서 최초 채팅창 로드시 한번만 실행되는거임
/*
	이거 생각해보니까 채팅창 열 때가 아니라
	페이지 로드시 바로 해줘야할거같음
	그래야 UNCHECKED_MSG_COUNT 초기화가 제때 됨
*/
function printChatList() {
	//우선 기존 DOM 초기화
	CHAT_LIST_OTO.replaceChildren();
	CHAT_LIST_OTM.replaceChildren();
	//미확인 채팅 총합 초기화
	UNCHECKED_MSG_COUNT = 0;

	//oto
	const otoFragment = document.createDocumentFragment();
	//otm
	const otmFragment = document.createDocumentFragment();
	
	//oto 요소 생성
	for(let arrEle of CHAT_OTO_VD) {
		//안 읽은 챗 개수 합산
		UNCHECKED_MSG_COUNT += arrEle.dataObj.uncheckedmsg;

		console.log(arrEle);

		//요소 틀
		const div = document.createElement("div");
		div.id = arrEle.eleId;
		div.classList.add("cc-list-oto-ele");
		//첫 자식 div
		const innerDivFir = document.createElement("div");
		div.appendChild(innerDivFir);
		//이미지
		/*
			추후 서버에서 이미지 링크를 받아 실제로 출력하게끔 수정해야함
		*/
		const img = document.createElement("img");
		if(!!arrEle.dataObj.userImage[0].sysname) {
			//실제 이미지
			img.src = "/user/thumbnail?sysname=" + arrEle.dataObj.userImage[0].sysname;
		} else {
			//임시 이미지
			img.src = "/images/layoutimg/logo.png";
		}
		img.alt = "Chat room image";
		innerDivFir.appendChild(img);
		//두번째 자식 div
		const innerDivSec = document.createElement("div");
		div.appendChild(innerDivSec);

		//title, p1(userid) 생성
		const h4 = document.createElement("h4");
		const p1 = document.createElement("p");

		//title, userid 처리 관련 분기(일반/일반 <-> 판매자/일반)
		if(!!arrEle.dataObj.pkgnum) {
			//판매자/일반
			h4.innerHTML = arrEle.dataObj.title;
			p1.innerHTML = arrEle.dataObj.userList[0].userid;
		} else {
			//일반/일반
			if(!!arrEle.dataObj.title) {
				h4.innerHTML = arrEle.dataObj.title;
				p1.innerHTML = arrEle.dataObj.userList[0].userid;
			} else {
				h4.innerHTML = arrEle.dataObj.userList[0].userid;
			}
		}
		
		//title, userid 할당
		innerDivSec.appendChild(h4);
		innerDivSec.appendChild(p1);
	
		//p2(chatContent)
		const p2 = document.createElement("p");
		p2.innerHTML = !!arrEle.dataObj.chatContent
						? arrEle.dataObj.chatContent
						: "아직 메시지가 없습니다";
		innerDivSec.appendChild(p2);
		//p3(chatContentRegdate 혹은 chatRegdate)
		const p3 = document.createElement("p");
		p3.innerHTML = !!arrEle.dataObj.chatContent
						? arrEle.dataObj.chatContentRegdate
						: arrEle.dataObj.chatRegdate;
		innerDivSec.appendChild(p3);
		//div(미확인 메시지 카운터)
		const counterDiv = document.createElement("div");
		if(arrEle.dataObj.uncheckedmsg > 0) {
			counterDiv.innerHTML = arrEle.dataObj.uncheckedmsg > 99 ? "99.." : arrEle.dataObj.uncheckedmsg;
		} else {
			counterDiv.classList.add("cc-hidden");
		}
		innerDivSec.appendChild(counterDiv);

		//fragment에 삽입
		otoFragment.appendChild(div);
	}

	//otm 요소 생성
	for(let arrEle of CHAT_OTM_VD) {
		//안 읽은 챗 개수 합산
		UNCHECKED_MSG_COUNT += arrEle.dataObj.uncheckedmsg;

		//요소 틀
		const div = document.createElement("div");
		div.id = arrEle.eleId;
		div.classList.add("cc-list-otm-ele");
		//첫 자식 div
		const innerDivFir = document.createElement("div");
		div.appendChild(innerDivFir);
		//이미지
		/*
			추후 서버에서 이미지 링크를 받아 실제로 출력하게끔 수정해야함
			+ 이미지도 List<>로 가져오게 해야 함
			반복문도 최대 4번이지만 이미지 개수 < 4 인 경우 그 만큼만 돌게 하고
			참여자가 3명일 때(유저 포함) 이미지를 기존 4등분이 아닌 좌우 2등분으로 바꿀 수 있게
			css도 짜 줘야 함
		*/
		for(let i = 0 ; i < 4; i++) {
			const img = document.createElement("img");
			if(!!arrEle.dataObj.userImage[i].sysname) {
				img.src = "/user/thumbnail?sysname=" + arrEle.dataObj.userImage[i].sysname;
			}
			img.alt = "Chat room image";
			innerDivFir.appendChild(img);
		}
		//두번째 자식 div
		const innerDivSec = document.createElement("div");
		div.appendChild(innerDivSec);

		//title, p1(userid) 생성
		const h4 = document.createElement("h4");
		const p1 = document.createElement("p");

		//userid들 묶은 문자열 생성
		let userids = "";
		for(let dto of arrEle.dataObj.userList) {
			userids += dto.userid + ",";
		}
		userids = userids.slice(0, -1);

		//title, userid 처리 관련 분기(일반/일반 <-> 판매자/일반)
		if(!!arrEle.dataObj.pkgnum) {
			//판매자/일반
			h4.innerHTML = arrEle.dataObj.title;
			p1.innerHTML = userids;
		} else {
			//일반/일반
			if(!!arrEle.dataObj.title) {
				h4.innerHTML = arrEle.dataObj.title;
				p1.innerHTML = userids;
			} else {
				h4.innerHTML = userids;
			}
		}
		
		//title, userid 할당
		innerDivSec.appendChild(h4);
		innerDivSec.appendChild(p1);
	
		//p2(chatContent)
		const p2 = document.createElement("p");
		p2.innerHTML = !!arrEle.dataObj.chatContent
						? arrEle.dataObj.chatContent
						: "아직 메시지가 없습니다";
		innerDivSec.appendChild(p2);
		//p3(chatContentRegdate 혹은 chatRegdate)
		const p3 = document.createElement("p");
		p3.innerHTML = !!arrEle.dataObj.chatContent
						? arrEle.dataObj.chatContentRegdate
						: arrEle.dataObj.chatRegdate;
		innerDivSec.appendChild(p3);
		//div(미확인 메시지 카운터)
		const counterDiv = document.createElement("div");
		if(arrEle.dataObj.uncheckedmsg > 0) {
			counterDiv.innerHTML = data.dataObj.uncheckedmsg > 99 ? "99.." : data.dataObj.uncheckedmsg;
		} else {
			counterDiv.classList.add("cc-hidden");
		}
		innerDivSec.appendChild(counterDiv);

		//fragment에 삽입
		otmFragment.appendChild(div);
	}

	//DOM에 fragment들 삽입
	CHAT_LIST_OTO.appendChild(otoFragment);
	CHAT_LIST_OTM.appendChild(otmFragment);
}

//VD기반 채팅방 리스트 수정
/*
	VD를 기반으로 DOM을 수정하는 함수
	oto -> otm의 경우 그냥 oto서 삭제시키고 otm에 추가하게 함
*/
function adjustChatList() {
	let flag = 0;
	/*
		ot*이 비어있으면 해당 페이지가 현재 열려있는 상태인지 확인
		열려있으면 open_CHAT_LIST_OT*()을 호출해 chat-list-empty를 띄운다

		함수 목적이랑 좀 안 맞기는 한데..
	*/
	if(CHAT_OTO_VD.length == 0) {
		CHAT_LIST_OTO.replaceChildren();
		if(!CHAT_LIST_OTO.classList.contains("cc-hidden")) {
			open_CHAT_LIST_OTO();
		}
		flag++;
	}
	if(CHAT_OTM_VD.length == 0) {
		CHAT_LIST_OTM.replaceChildren();
		if(!CHAT_LIST_OTM.classList.contains("cc-hidden")) {
			open_CHAT_LIST_OTM();
		}
		flag++;
	}
	if(flag == 2) {
		return;
	}

	const otoDom = CHAT_LIST_OTO.children;
	const otmDom = CHAT_LIST_OTM.children;

	//OTO
	let i = 0;
	for(; i < CHAT_OTO_VD.length; i++) {
		//요소 순서 맞추기
		if(otoDom.item(i) == null) {
			//DOM에 i번째 요소~ 가 없음
			//추가
			const newEle = createChatListElement(CHAT_OTO_VD[i], true);
			// otoDom.item(i).before(newEle);
			CHAT_LIST_OTO.appendChild(newEle);
			//요소 생성시 내부 값 수정을 스킵
			continue;
		}
		else if(otoDom.item(i).id != CHAT_OTO_VD[i].eleId) {
			//DOM의 i번째 자리에 VD와 다른 요소가 있음
			//순회하면서 찾는다
			let tgtEle = null
			for(let ele of otoDom) {
				if(ele.id === CHAT_OTO_VD[i].eleId) {
					tgtEle = ele;
					break;
				}
			}
			if(!!!tgtEle) {
				//없으면 새로 추가
				const newEle = createChatListElement(CHAT_OTO_VD[i], true);
				otoDom.item(i).before(newEle);
				//요소 생성시 내부 값 수정은 스킵
				continue;
			} else {
				//있으면 옮기기
				otoDom.item(i).before(tgtEle);
			}
		}

		//요소 내부 값 맞추기
		//DOM 요소를 생성하지 않은 경우 내부 값을 체크, 수정사항을 적용한다
		adjustChatListElement(CHAT_OTO_VD[i], otoDom.item(i), true);
	}

	//OTM
	let j = 0;
	for(; j < CHAT_OTM_VD.length; j++) {
		//요소 순서 맞추기
		if(otmDom.item(j) == null) {
			//DOM에 i번째 요소~ 가 없음
			//추가
			const newEle = createChatListElement(CHAT_OTM_VD[j], false);
			// otmDom.item(i).before(newEle);
			CHAT_LIST_OTM.appendChild(newEle);
			//요소 생성시 내부 값 수정을 스킵
			continue;
		}
		else if(otmDom.item(j).id != CHAT_OTM_VD[j].eleId) {
			//DOM의 i번째 자리에 VD와 다른 요소가 있음
			//순회하면서 찾는다
			let tgtEle = null
			for(let ele of otmDom) {
				if(ele.id === CHAT_OTM_VD[j].eleId) {
					tgtEle = ele;
					break;
				}
			}
			if(!!!tgtEle) {
				//없으면 새로 추가
				const newEle = createChatListElement(CHAT_OTM_VD[j], false);
				otmDom.item(j).before(newEle);
				//요소 생성시 내부 값 수정은 스킵
				continue;
			} else {
				//있으면 옮기기
				otmDom.item(j).before(tgtEle);
			}
		}

		//요소 내부 값 맞추기
		//DOM 요소를 생성하지 않은 경우 내부 값을 체크, 수정사항을 적용한다
		adjustChatListElement(CHAT_OTM_VD[j], otmDom.item(j), false);
	}

	//VD에 없는 요소 삭제
	while(otoDom.item(i) != null) {
		otoDom.item(i).remove();
	}
	while(otmDom.item(j) != null) {
		otmDom.item(j).remove();
	}
}
function adjustChatListElement(cr, tgtEle, isOTO=true) {
	//이미지
	// if(isOTO) {
	// 	const img = document.createElement("img");
	// 	if(!!cr.dataObj.userImage[0].sysname) {
	// 		img.src = "/user/thumbnail?sysname=" + cr.dataObj.userImage[0].sysname;
	// 	} else {
	// 		img.src = "/images/layoutimg/logo.png";
	// 	}
	// 	img.alt = "Chat room image";
	// 	innerDivFir.appendChild(img);
	// } else {
	// 	for(let i = 0 ; i < 4; i++) {
	// 		const img = document.createElement("img");
	// 		if(!!cr.dataObj.userImage[i].sysname) {
	// 			img.src = "/user/thumbnail?sysname=" + cr.dataObj.userImage[i].sysname;
	// 		}
	// 		img.alt = "Chat room image";
	// 		innerDivFir.appendChild(img);
	// 	}
	// }
	const innerDivFir = tgtEle.children[0];
	innerDivFir.replaceChildren();
	if(isOTO) {
		const img = document.createElement("img");
		if(!!cr.dataObj.userImage[0].sysname) {
			img.src = "/user/thumbnail?sysname=" + cr.dataObj.userImage[0].sysname;
		} else {
			img.src = "/images/layoutimg/logo.png";
		}
		img.alt = "Chat room image";
		innerDivFir.appendChild(img);
	} else {
		for(let i = 0 ; i < 4; i++) {
			const img = document.createElement("img");
			if(!!cr.dataObj.userImage[i].sysname) {
				img.src = "/user/thumbnail?sysname=" + cr.dataObj.userImage[i].sysname;
			}
			img.alt = "Chat room image";
			innerDivFir.appendChild(img);
		}
	}
	const innerDivSec = tgtEle.children[1];
	//title, p1(userid)
	let userids = "";
	for(let dto of cr.dataObj.userList) {
		userids += dto.userid + ", ";
	}
	userids = userids.slice(0, -2);
	if(!!cr.dataObj.pkgnum) {
		//판매자/일반
		innerDivSec.children[0].innerHTML = cr.dataObj.title;
		innerDivSec.children[1].innerHTML = userids
	} else {
		//일반/일반
		if(!!cr.dataObj.title) {
			//title 존재시
			innerDivSec.children[0].innerHTML = cr.dataObj.title;
			innerDivSec.children[1].innerHTML = userids;
		} else {
			//title이 없을때
			innerDivSec.children[0].innerHTML = userids;
			innerDivSec.children[1].innerHTML = "";
		}
	}
	//p2(chatContent)
	innerDivSec.children[2].innerHTML = !!cr.dataObj.chatContent
										? cr.dataObj.chatContent
										: "아직 메시지가 없습니다";
	//p3(chatContentRegdate 혹은 chatRegdate)
	innerDivSec.children[3].innerHTML = !!cr.dataObj.chatContent
										? cr.dataObj.chatContentRegdate
										: cr.dataObj.chatRegdate;
	//div(미확인 메시지 카운터)
	if(cr.dataObj.uncheckedmsg > 0) {
		innerDivSec.children[4].innerHTML = cr.dataObj.uncheckedmsg > 99 ? "99.." : cr.dataObj.uncheckedmsg;
	} else {
		innerDivSec.children[4].classList.add("cc-hidden");
	}
}
function createChatListElement(cr, isOTO=true) {
	//요소 틀
	const div = document.createElement("div");
	div.id = cr.eleId;
	div.classList.add(isOTO ? "cc-list-oto-ele" : "cc-list-otm-ele");
	//첫번째 자식 div
	const innerDivFir = document.createElement("div");
	div.appendChild(innerDivFir);
	//이미지
	/*
		일단 지금은 임시 이미지 출력
		나중에 이미지 링크를 List<String>으로 받아와 넣어줘야 함
		+ 이미지 개수 > 4인 경우 4개까지만, 출력할 이미지가 2개일 때는
		css도 4등분 대신 2등분으로 하게 짜줘야 함

		UserImgDTO 사용함 인제
	*/
	if(isOTO) {
		const img = document.createElement("img");
		console.log(cr.dataObj.userImage);
		if(!!cr.dataObj.userImage[0].sysname) {
			img.src = "/user/thumbnail?sysname=" + cr.dataObj.userImage[0].sysname;
		} else {
			img.src = "/images/layoutimg/logo.png";
		}
		img.alt = "Chat room image";
		innerDivFir.appendChild(img);
	} else {
		for(let i = 0 ; i < 4; i++) {
			const img = document.createElement("img");
			if(!!cr.dataObj.userImage[i].sysname) {
				img.src = "/user/thumbnail?sysname=" + cr.dataObj.userImage[i].sysname;
			}
			img.alt = "Chat room image";
			innerDivFir.appendChild(img);
		}
	}
	//두번째 자식 div
	const innerDivSec = document.createElement("div");
	div.appendChild(innerDivSec);
	//title, p1(userid) 생성
	const h4 = document.createElement("h4");
	const p1 = document.createElement("p");
	//userid를 묶은 문자열 생성
	let userids = "";
	for(let dto of cr.dataObj.userList) {
		userids += dto.userid + ", ";
	}
	userids = userids.slice(0, -2);
	//title, userid 처리 관련 분기(일반/일반 <-> 판매자/일반)
	if(!!cr.dataObj.pkgnum) {
		//판매자/일반
		h4.innerHTML = cr.dataObj.title;
		p1.innerHTML = userids
	} else {
		//일반/일반
		if(!!cr.dataObj.title) {
			//title 존재시
			h4.innerHTML = cr.dataObj.title;
			p1.innerHTML = userids;
		} else {
			//title이 없을때
			h4.innerHTML = userids;
		}
	}
	//h4, p1(userid) 할당
	innerDivSec.appendChild(h4);
	innerDivSec.appendChild(p1);
	//p2(chatContent)
	const p2 = document.createElement("p");
	p2.innerHTML = !!cr.dataObj.chatContent
					? cr.dataObj.chatContent
					: "아직 메시지가 없습니다";
	innerDivSec.appendChild(p2);
	//p3(chatContentRegdate 혹은 chatRegdate)
	const p3 = document.createElement("p");
	p3.innerHTML = !!cr.dataObj.chatContent
					? cr.dataObj.chatContentRegdate
					: cr.dataObj.chatRegdate;
	innerDivSec.appendChild(p3);
	//div(미확인 메시지 카운터)
	const counterDiv = document.createElement("div");
	if(cr.dataObj.uncheckedmsg > 0) {
		counterDiv.innerHTML = cr.dataObj.uncheckedmsg > 99 ? "99.." : cr.dataObj.uncheckedmsg;
	} else {
		counterDiv.classList.add("cc-hidden");
	}
	innerDivSec.appendChild(counterDiv);

	//반환
	return div;
}

/*================================================================================*/
/*AJAX*/
/*
	참조
	queryStrings, body, header는 js 객체 형태로 삽입
	반환되는 데이터는 무조건 JSON으로 수신 -> JS 객체화
*/

//GET
/**
 * AJAX로 GET 요청을 보내고 응답을 받는 함수
 * 
 * then-catch나 async-await으로 받으면 됨
 * 
 * @example
 * ajaxGet("localhost:8080", "/chat", {
 *     //쿼리스트링에 넣을 키-값 을 JS 객체 형태로 삽입
 *     //넣을 값이 없으면 생략 가능함
 *     userid1: USER_ID,
 *     userid2: "qwerty1234",
 *     userid3: document.getElementById("polehammeroverheadfullswing").value,
 *     ...
 * }).then((data) => {
 *     //수신 후 처리
 * }).catch((error) => {
 *     //송수신 실패시 처리
 * });
 * 
 * @param {string} host host 주소 (localhost:8080의 형태로 마지막 슬래시를 생략)
 * @param {string} path path 주소 (/chat 의 형태로 시작 슬래시를 꼭 작성)
 * @param {Object} queryStrings 쿼리스트링으로 넣을 키-값, JS 객체의 형태로 삽입, 생략 가능함
 * @returns {Promise<*>} 반환값은 JSON으로 수신 -> JS 객체화 -> Promise로 포장 후 반환 의 단계를 거침
 */
async function ajaxGet(host, path, queryStrings={}) {
	let qs = "";
	if(Object.keys(queryStrings).length > 0) {
		qs += "?";
		for(let key in queryStrings) {
			qs += key + "=" + queryStrings[key] + "&";
		}
		qs = qs.replace(/\&$/, "");
	}

	const url = "http://" + host + path + qs;

	const res = await fetch(url);
	const data = await res.json();

	if(res.ok) {
		return data;
	} else {
		throw Error(res);
	}
}
//POST
/**
 * AJAX로 POST 요청을 보내고 응답을 받는 함수
 * 
 * Content-Type은 application/json
 * 
 * then-catch나 async-await으로 받으면 됨
 * 
 * @example
 * ajaxPost("localhost:8080", "/chat", {
 *     //body에 담을 키-값, 생략 불가능
 * }, {
 *     //header에 담을 키-값, 생략가능
 * })
 * .then((data) => {
 *     //수신 후 처리
 * })
 * .catch((error) => {
 *     //송수신 실패시 처리
 * });
 * 
 * @param {string} host host 주소 (localhost:8080의 형태로 마지막 슬래시를 생략)
 * @param {string} path path 주소 (/chat 의 형태로 시작 슬래시를 꼭 작성)
 * @param {Object} body 요청 body에 담을 키-값, JS 객체 형태로 삽입, 생략 불가능
 * @param {Object} header 요청 header에 담을 키-값, JS 객체 형태로 삽입, 생략 가능
 * @returns {Promise<*>} 반환값은 JSON으로 수신 -> JS 객체화 -> Promise로 포장 의 단계를 거침
 */
async function ajaxPost(host, path, body, header={}) {
	const url = "http://" + host + path;
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...header,
		},
		body: JSON.stringify(body)
	};

	console.log(options);

	const res = await fetch(url, options);
	const data = await res.json();

	if(res.ok) {
		return data;
	} else {
		throw Error(res);
	}
}