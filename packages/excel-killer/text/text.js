module.exports = {
    text_root1: "root",
    text_root2: "root",
    "object-object-text": {
        0: {
            skill_id: 1,
            level_item: {
                skill_id: 1,
                percentage: 100,
                skill_name: "技能",
                extend: {
                    a: 0,
                    b: 0
                }
            }
        },
        1: {
            skill_id: 1,
            level_item: {
                skill_id: 2,
                percentage: 100,
                skill_name: "技能",
                extend: {
                    a: 0,
                    b: 0
                }
            }
        }
    },
    "object-object-array-text": {
        0: {
            skill_id: 1,
            sprite_frame: '""',
            lv: 0,
            lv_max: 10,
            level_item: {
                skill_id: 1,
                percentage: 100,
                skill_name: "技能",
                extend: {
                    0: 80,
                    1: 100,
                    2: 120
                }
            }
        },
        9: {
            skill_id: 1,
            sprite_frame: '""',
            lv: 0,
            lv_max: 10,
            level_item: {
                skill_id: 10,
                percentage: 100,
                skill_name: "技能",
                extend: {
                    0: {
                        skill_id: 1,
                        sprite_frame: '""'
                    },
                    1: {
                        skill_id: 1,
                        sprite_frame: '""'
                    }
                }
            }
        },
        10: {
            skill_id: 1,
            sprite_frame: '""',
            lv: 0,
            lv_max: 10,
            level_item: {
                skill_id: 11,
                percentage: 100,
                skill_name: "技能",
                extend: {
                    0: {
                        skill_id: 1,
                        level_item: {
                            skill_id: 1,
                            percentage: 100,
                            skill_name: "技能",
                            extend: {
                                a: 0,
                                b: 0
                            }
                        }
                    },
                    1: {
                        skill_id: 1,
                        level_item: {
                            skill_id: 2,
                            percentage: 100,
                            skill_name: "技能",
                            extend: {
                                a: 0,
                                b: 0
                            }
                        }
                    }
                }
            }
        }
    }
};