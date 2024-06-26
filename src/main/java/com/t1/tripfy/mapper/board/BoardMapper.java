package com.t1.tripfy.mapper.board;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.t1.tripfy.domain.dto.Criteria;
import com.t1.tripfy.domain.dto.board.BoardDTO;
import com.t1.tripfy.domain.dto.board.BoardFileDTO;
import com.t1.tripfy.domain.dto.board.BoardLikeDTO;
import com.t1.tripfy.domain.dto.board.BoardReplyDTO;
import com.t1.tripfy.domain.dto.board.BoardaddrDTO;

@Mapper
public interface BoardMapper {
	// boardnum으로 게시글 데이터 긁어오기
	BoardDTO getBoardByBoardNum(long boardnum);
	
	// 전체 게시글 긁어오기
	List<BoardDTO> getList(Criteria cri);
	List<BoardDTO> getMyList(Criteria cri, String userid);

	// 전체 게시글 개수
	long getTotal(Criteria cri);

	// 좋아요 순 게시글 긁어오기
	List<BoardDTO> getlikeList(Criteria cri);
	
	// 인기 순 게시글 긁어오기
	List<BoardDTO> getpopularList(Criteria cri);

	//댓글 수 업다운
	int addReplyCnt(long boardnum);
	int reduceReplyCnt(long boardnum);
	
	// 게시글 등록(insert)
	int insertBoard(BoardDTO board);

	// 특정 userid로 작성된 게시글 번호 중 마지막 번호
	long getLastNum(String userid);
	
	// ----- 파일 -----
	// C
	int insertFile(BoardFileDTO file);
	
	// R
	BoardFileDTO getFileBySystemname(String systemname);
	List<BoardFileDTO> getFiles(long boardnum);
	//보드넘으로 보드 썸네일 긁어오기
//	BoardFileDTO getBoardThumnail(long boardnum);
	
	// D
	int deleteFilesBySystemname(String systemname);
	int deleteFilesByBoardnum(long boardnum);

	BoardaddrDTO getBoardaddrByBoardnum(long boardnum);
	
	// boardaddr insert
	int insertBoardAddr(BoardaddrDTO boardaddr);

	// 게시글 삭제
	int deleteBoard(long boardnum);

	int deleteBoardaddr(long boardnum);

	// boardnum으로 썸네일 가져오기
	BoardFileDTO getThumbnail(long boardnum);

	int updateBoard(BoardDTO board);

	int updateBoardAddr(BoardaddrDTO boardaddr);

	// 조회수 증가
	int updateViewCnt(@Param("boardnum") long boardnum, @Param("viewcnt") long viewcnt);

	// 해당 userid가 해당 board에 좋아요 눌렀는지 찾음
	BoardLikeDTO getBoardLike(@Param("userid") String userid, @Param("boardnum") long boardnum);

	// 좋아요 등록
	int likeRegist(@Param("userid") String userid, @Param("boardnum") long boardnum);

	// 좋아요 취소
	int likeDelete(@Param("userid") String userid, @Param("boardnum") long boardnum);

	// 좋아요 수 업데이트
	int updateLikeCnt(@Param("boardnum") long boardnum, @Param("likecnt") long likecnt);

	// boardnum으로 해당 게시글에 있는 좋아요 클릭된 것 찾음
	BoardLikeDTO getTotalBoardLike(long boardnum);

	// boardnum으로 해당 게시글에 있는 좋아요 클릭된 것 삭제
	int deleteTotalBoardLike(long boardnum);

	// boardnum으로 해당 게시글의 댓글 찾음
	List<BoardReplyDTO> getTotalBoardReply(long boardnum);

	// boardnum으로 해당 게시글의 댓글 삭제
	int deleteTotalBoardReply(long boardnum);
}
