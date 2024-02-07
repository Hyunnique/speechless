package speechless.community.presentation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.presentation.Auth;
import speechless.community.application.CommunityService;
import speechless.community.domain.Community;
import speechless.community.dto.request.CreateCommunityRequest;
import speechless.community.dto.response.GetCommunitiesResponse;
import speechless.community.dto.response.GetCommunityResponse;
import speechless.community.dto.response.PostCommunityResponse;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/community")
@Tag(name = "커뮤니티", description = "함께 발표연습하기")
public class CommunityController {
    private final CommunityService communityService;

    @PostMapping
    @Operation(summary = "글 작성", description = "함께 발표연습하기 글작성")
    public ResponseEntity<PostCommunityResponse> createCommunity(@Auth AuthCredentials authCredentials, @RequestBody @Valid CreateCommunityRequest createCommunityRequest) {
        Community community = communityService.createCommunity(authCredentials.id(), createCommunityRequest);
        return ResponseEntity.ok(new PostCommunityResponse(community.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "특정 글 조회", description = "ID를 통해 특정 글 정보를 조회")
    public ResponseEntity<GetCommunityResponse> getCommunityById(@PathVariable Long id) {
        Community community = communityService.getCommunityById(id);
        community.increaseHit();
        return ResponseEntity.ok(GetCommunityResponse.from(community));
    }

    @GetMapping
    @Operation(summary = "모든 글 조회(커서기반 페이지네이션)", description = "등록된 모든 글의 정보를 조회")
    public ResponseEntity<GetCommunitiesResponse> getCommunityList(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String writerName,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean recruiting,
            @RequestParam(required = false) Integer maxParticipants,
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "10") int limit) {
        GetCommunitiesResponse response = communityService.getCommunityList(title, writerName, content, category, recruiting, maxParticipants, cursor, limit);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "글 업데이트", description = "특정 글을 업데이트합니다.")
    public ResponseEntity<?> updateCommunity(@Auth AuthCredentials authCredentials, @PathVariable Long id, @RequestBody CreateCommunityRequest createCommunityRequest) {
        communityService.updateCommunity(authCredentials.id(), id, createCommunityRequest);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "글 삭제", description = "특정 글을 삭제합니다.")
    public ResponseEntity<?> deleteCommunity(@Auth AuthCredentials authCredentials, @PathVariable Long id) {
        communityService.deleteCommunity(authCredentials.id(), id);
        return ResponseEntity.noContent().build();
    }
}
