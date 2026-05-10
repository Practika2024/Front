import React from "react";
import PropTypes from "prop-types";
import { getRoleBadge, rolesFromUserRecord, toRoleArray } from "../../utils/helpers/roleAvatar";

/**
 * Позначка ролі замість фото (емодзі + підказка).
 */
export default function RoleAvatarMark({
  roles,
  user,
  sizePx = 40,
  className = "",
  showLabel = false,
}) {
  const list = user ? rolesFromUserRecord(user) : toRoleArray(roles);
  const { emoji, label } = getRoleBadge(list);
  const fontPx = Math.max(12, Math.round(sizePx * 0.52));

  return (
    <div
      className={`d-inline-flex flex-column align-items-center ${className}`}
      title={label}
    >
      <span
        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-25 border border-secondary border-opacity-25 user-select-none"
        style={{ width: sizePx, height: sizePx, fontSize: fontPx }}
        role="img"
        aria-label={label}
      >
        {emoji}
      </span>
      {showLabel ? (
        <span className="small text-muted text-center mt-1" style={{ maxWidth: sizePx * 2.5 }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

RoleAvatarMark.propTypes = {
  roles: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  user: PropTypes.object,
  sizePx: PropTypes.number,
  className: PropTypes.string,
  showLabel: PropTypes.bool,
};
