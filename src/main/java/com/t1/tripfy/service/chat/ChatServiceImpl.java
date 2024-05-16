package com.t1.tripfy.service.chat;

import java.util.ArrayList;

import com.t1.tripfy.domain.dto.chat.old.ChatDTO;

public class ChatServiceImpl implements ChatService {

	@Override
	public Long createChat(String userid, Long packagenum) {
		return null;
	}

	@Override
	public ArrayList<ChatDTO> selectChatByUserid(String userid) {
		return null;
	}

	//안 읽은 채팅 개수 가져오기
	@Override
	public Integer selectCountOfUnreadChatByUserid(String userid) {
		/* 대충 로직 구상 - 240516
		 * 
		 * + 트랜잭션 넣을까 말까 넣을까 말까 넣을까 말까 넣을까 말까 넣을까 말까 넣ㅁㄴㅇㄹ
		 * 
		 * 1 chat_user에서 userid가 있는지 확인
		 *  - userid의 유저가 들어가있는 채팅방이 존재하는지 확인
		 *  
		 *  1-1 없는 경우
		 *   - 0 반환
		 *  
		 *  1-2 있는 경우
		 *   - ArrayList<ChatUserDTO>로 묶어서 가져오기
		 * 
		 * 2 가져온 ArrayList<ChatUserDTO>를 까보기
		 *  - 순회하면서 각 채팅방의 마지막 조회 메시지를 파악, 이를 기준으로 안 읽은 개수를 긁어온다
		 * 
		 *  2-1 chat_detail_idx가 null인 경우
		 *   - 해당 채팅방에 메시지가 없거나 임마가 메시지를 하나도 쳐 안 읽은거다
		 *   - 둘다 결국 chat_detail을 까봐야 함
		 *   
		 *   2-1-1 chat_detail 까보기
		 *    - 행의 개수를 세본다
		 *      행의 개수가 바로 임마가 안 읽은 메시지 개수다
		 *      0인 경우 메시지가 없는 채팅방임
		 *    - 결과값을 += 한다
		 *  
		 *  2-2 chat_detail_idx가 null이 아닌 경우
		 *   - 행의 개수를 세는데 조건을 아래와 같이 준다
		 *     chat_room_idx = #{chatRoowIdx} AND chat_detail_idx > #{chatDetailIdx} AND userid != #{userid}
		 *    - 대충 해당 채팅방 메시지 중 마지막 조회 메시지보다 높은(이후 시점의) 메시지, 그 중에서도 사용자가 작성하지 않은
		 *   - 수정
		 *     chat_room_idx = #{chatRoowIdx} AND chat_detail_idx > #{chatDetailIdx}
		 *    - chat_user.chat_detail_idx를 자기 자신의 메시지도 넣게 해두면 채팅개수 select시 userid 검증이 필요없음
		 *      D:\240430_tp3\memo 참조
		 *   - 하여간 뽑은 결과값을 += 한다
		 *   
		 * 3 합산한 결과값을 반환한다
		 *  - ㅇㅇ
		 *  3-1 중간에 오류가 생긴 경우
		 *   - 생길 수가 있나..?
		 *     일단 생기면 null 반환
		 * */
		return null;
	}

}
