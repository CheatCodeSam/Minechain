package com.minechain.minechain.services;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.minechain.types.RepossessedDto;
import com.minechain.minechain.types.SoldDto;

@Singleton
public class PropertyService {

  private RegionService regionService;

  @Inject
  public PropertyService(RegionService regionService) {
    this.regionService = regionService;
  }

  public void sold(SoldDto soldDto) {
    var tokenId = soldDto.getTokenId();
    if (soldDto.hasLinkedAccount()) {
      this.regionService.updateOwner(tokenId, soldDto.getLinkedAccount());
    } else {
      this.regionService.setGhostProperty(tokenId);
    }
    this.regionService.updateScoreBoard(tokenId, soldDto.getOwnerDisplayName(), soldDto.getPrice());
    regionService.emitFireworks(tokenId);
  }

  public void repossessed(RepossessedDto repossessedDto) {
    var tokenId = repossessedDto.getTokenId();
    this.regionService.setGhostProperty(tokenId);
  }

}
