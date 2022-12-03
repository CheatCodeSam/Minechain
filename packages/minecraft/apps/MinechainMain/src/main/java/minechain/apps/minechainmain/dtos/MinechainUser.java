package minechain.apps.minechainmain.dtos;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public class MinechainUser {

  public Integer id;
  public Boolean isActive;
  public String publicAddress;
  public UUID mojangId;
  public Date dateJoined;
  public Date lastLogin;
  public Boolean isSuperUser;
  public String shortName;
  public String lastKnownRegion;
  public List<Integer> tokens;
}
