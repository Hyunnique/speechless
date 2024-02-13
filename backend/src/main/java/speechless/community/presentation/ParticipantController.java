package speechless.community.presentation;

import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.presentation.Auth;
import speechless.community.application.ParticipantService;
import speechless.community.domain.Participant;
import speechless.community.dto.response.ParticipantCommunityResponse;
import speechless.community.dto.response.ParticipantListResponse;

@RestController
@AllArgsConstructor
@RequestMapping("/participant")
public class ParticipantController {

    private ParticipantService participantService;

    @PostMapping("/{community_id}")
    public ResponseEntity<Participant> createParticipant(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @PathVariable("community_id") Long communityId
    ) {
        return new ResponseEntity<>(participantService.createParticipant(authCredentials, communityId), HttpStatus.CREATED);
    }

    @DeleteMapping("/{community_id}")
    public ResponseEntity<?> deleteParticipant(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @PathVariable("community_id") Long communityId
    ) {
        participantService.deleteParticipant(authCredentials, communityId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/finished")
    public ResponseEntity<ParticipantListResponse> finishedCommunityList(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestParam Integer pageSize, @RequestParam Integer pageNum
    ) {
        return new ResponseEntity<>(participantService.getFinishedParticipants(authCredentials, pageSize, pageNum),
            HttpStatus.OK);
    }

    @GetMapping("/reserved")
    public ResponseEntity<ParticipantListResponse> reservedCommunityList(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestParam Integer pageSize, @RequestParam Integer pageNum
    ) {
        return new ResponseEntity<>(participantService.getReservedParticipants(authCredentials, pageSize, pageNum),
            HttpStatus.OK);
    }

    @GetMapping("/current")
    public ResponseEntity<List<ParticipantCommunityResponse>> currentCommunityList(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials
    ){
        return new ResponseEntity<>(participantService.getCurrentParticipants(authCredentials),
            HttpStatus.OK);
    }

    @GetMapping("/next")
    public ResponseEntity<List<ParticipantCommunityResponse>> nextCommunityList(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials
    ){
        return new ResponseEntity<>(participantService.getNextParticipants(authCredentials), HttpStatus.OK);
    }
}
