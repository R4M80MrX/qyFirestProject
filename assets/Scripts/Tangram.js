const Value = require('Value');

cc.Class({
    extends: cc.Component,

    properties: {
        drawPrefab: cc.Prefab,
        title: cc.Label,
        came: cc.Node,
        popup: cc.Prefab,
    },

    onLoad() {
        // 标题
        this.title.getComponent(cc.Label).string = Value.chooseData.LevelName + '-' + Value.chooseData.RoundNum;
        // came包围盒
        this.cameBox = this.came.getBoundingBox();
        // came对齐坐标点
        this.camePoint = [];
        this.getCamePoint();
        // 开启碰撞组件
        cc.director.getCollisionManager().enabled = true;
        // 预制体集合数组
        this.children = [];
        // 选择对象
        this.choice = null;
        // 面积量
        this.rectArea = 0;
        this.addPrefab();
    },

    // 取对齐点
    getCamePoint() {
        let boxY = 0;
        let boxX = 0;
        let boxHeight = Math.round(this.cameBox.height);
        let boxWidth = Math.round(this.cameBox.width);

        for (var y = boxY; y <= boxY + boxHeight;) {
            for (var x = boxX; x <= boxX + boxWidth;) {
                let point = this.came.convertToWorldSpace(new cc.Vec2(x, y));
                this.camePoint.push(point);
                x += 60;
            };
            y += 60;
        };
    },

    // 生成预制体
    addPrefab() {
        // 取出数据
        let pointsArray = Value.data.graphicsArray;
        let colorArray = Value.data.color;
        // 创建画图预制体
        for (var a = 0; a < pointsArray.length; a++) {
            // 实例预制体
            let obj = cc.instantiate(this.drawPrefab);
            // 面积量
            obj.prefabArea = 0;
            // 是否已经放置在came内值  0：未放置 1:已放置 
            obj.inCame = 0;
            // 预制体碰撞组件
            let manager = obj.getComponent(cc.PolygonCollider);
            // 预制体画图组件
            let prefabCtx = obj.getComponent(cc.Graphics);

            // 填充颜色
            prefabCtx.fillColor = cc.hexToColor(colorArray[a]);
            // 临时数组
            let array = pointsArray[a];
            // 取点画线
            let deviation = this.pointDeviation(array[0]);
            for (var b = 0; b < array.length; b++) {
                if (b == 0) {
                    prefabCtx.moveTo(0, 0);
                    manager.points.push(new cc.Vec2(0, 0));
                }
                else {
                    prefabCtx.lineTo(array[b].x + deviation.x, array[b].y + deviation.y);
                    manager.points.push(new cc.Vec2(array[b].x + deviation.x, array[b].y + deviation.y));
                }
            }
            prefabCtx.close();
            prefabCtx.fill();
            // 添加预制体
            this.node.addChild(obj);
            // 设置位置
            let posY;
            if (a % 2 == 0) {
                posY = -350;
            }
            else {
                posY = -320;
            };
            if (Value.picNum < 7) {
                obj.selfPosition = obj.position = new cc.Vec2((a * 130) - 360, posY);
            }
            else {
                obj.selfPosition = obj.position = new cc.Vec2((a * 80) - 360, posY);
            }
        };

        // 预制子节点集合
        let nodeChildren = this.node.children;
        for (var i = 0; i < nodeChildren.length; i++) {
            if (nodeChildren[i].name == 'DrawPrefab') {
                this.children.push(nodeChildren[i]);
            }
        };

        // 监听
        this.node.on('touchstart', this.startTouch, this);
        this.node.on('touchmove', this.moveTouch, this);
        this.node.on('touchend', this.endTouch, this);

    },

    // 获取选中对象
    startTouch(event) {
        for (var a = 0; a < this.children.length; a++) {
            let worldPoints = this.children[a].getComponent(cc.PolygonCollider).world.points;
            if (cc.Intersection.pointInPolygon(event.getLocation(), worldPoints)) {
                this.choice = this.children[a];
                this.choice.scaleX = 1;
                this.choice.scaleY = 1;
                this.choice.zIndex = 1;
                break;
            };
        };
    },

    // 更新位置
    moveTouch(event) {
        if (this.choice != null) {
            this.choice.position = this.choice.position.add(event.getDelta());
        };
    },

    // 放置判断
    endTouch() {
        if (this.choice != null) {
            this.choice.zIndex = 0;
            //选中对象的碰撞组件
            let collider = this.choice.getComponent(cc.PolygonCollider);
            // 取最顶点
            let topPoint = collider.world.points[0];
            let buttonPoint = collider.world.points[0];
            let leftPoint = collider.world.points[0];
            let rightPoint = collider.world.points[0];
            for (var a = 1; a < collider.world.points.length; a++) {
                topPoint = this.top(topPoint, collider.world.points[a]);
                buttonPoint = this.button(buttonPoint, collider.world.points[a]);
                leftPoint = this.left(leftPoint, collider.world.points[a]);
                rightPoint = this.right(rightPoint, collider.world.points[a]);
            };
            // 图形矩形
            let rect = new cc.rect(leftPoint.x, buttonPoint.y, rightPoint.x - leftPoint.x, topPoint.y - buttonPoint.y);
            // came世界矩形
            let cameRectPosition = this.came.convertToWorldSpace(cc.Vec2.ZERO);
            let cameRect = new cc.rect(cameRectPosition.x, cameRectPosition.y, this.cameBox.width, this.cameBox.height);
            // 重叠面积
            let area = cc.rectIntersection(cameRect, rect);
            // 通过重叠面积判断是否近似
            if (area.height * area.width > rect.height * rect.width * 0.93) {
                this.setPoint(collider);
                this.scheduleOnce(this.overlay, 0.01);
            }
            else {
                this.backPosition();
                this.choice = null;
            };
        };
    },

    // 返回原形
    backPosition() {
        this.choice.scaleX = 0.25;
        this.choice.scaleY = 0.25;
        this.choice.zIndex = 0;
        this.choice.inCame = 0;
        this.choice.prefabArea = 0;
        this.choice.position = this.choice.selfPosition;
    },

    // 通关判断
    win() {
        for (var a = 0; a < this.children.length; a++) {
            this.rectArea += this.children[a].prefabArea;
            if (this.rectArea == 360000) {
                let chooseData = Value.chooseData;
                let key = chooseData.GameName + '-' + chooseData.LevelName;
                let gameData = JSON.parse(cc.sys.localStorage.getItem(key));
                if (gameData.haveRound < chooseData.RoundNum) {
                    gameData.haveRound++;
                    cc.sys.localStorage.setItem(key, gameData);
                };

                let up = cc.instantiate(this.popup);
                this.node.addChild(up);
            }
        }
        this.rectArea = 0;
    },

    // 设置对齐点
    setPoint(collider) {
        for (var n = 0; n < this.camePoint.length; n++) {
            var isFuzzy = cc.pFuzzyEqual(this.node.convertToWorldSpaceAR(this.choice.position), this.camePoint[n], 35);
            if (isFuzzy == true) {
                let p = this.node.convertToNodeSpaceAR(this.camePoint[n]);
                this.choice.position = p;
                break;
            };
        };
    },

    // 多边形面积
    polygonArea(points) {
        var i, j;
        var area = 0;
        for (i = 0; i < points.length; i++) {
            j = (i + 1) % points.length;
            area += points[i].x * points[j].y;
            area -= points[i].y * points[j].x;
        }
        area /= 2;
        return Math.abs(area);
    },

    // 点的偏移
    pointDeviation(point) {
        var state;
        var deviation = new cc.Vec2(0, 0);
        if (point.x < 0 && point.y < 0) {
            state = 1;
        }
        else if (point.x < 0 && point.y > 0) {
            state = 2;
        }
        else if (point.x > 0 && point.y > 0) {
            state = 3;
        }
        else if (point.x > 0 && point.y < 0) {
            state = 4;
        }
        else if (point.x == 0 && point.y < 0) {
            state = 5;
        }
        else if (point.x < 0 && point.y == 0) {
            state = 6;
        }
        else if (point.x == 0 && point.y > 0) {
            state = 7;
        }
        else if (point.x > 0 && point.y == 0) {
            state = 8;
        };
        switch (state) {
            case 1:
                deviation.x -= point.x;
                deviation.y -= point.y;
                break;
            case 2:
                deviation.x -= point.x;
                deviation.y -= point.y;
                break;
            case 3:
                deviation.x -= point.x;
                deviation.y -= point.y;
                break;
            case 4:
                deviation.x -= point.x;
                deviation.y -= point.y;
                break;
            case 5:
                deviation.y -= point.y;
                break;
            case 6:
                deviation.x -= point.x;
                break;
            case 7:
                deviation.y -= point.y;
                break;
            case 8:
                deviation.x -= point.x;
                break;
        };
        return deviation;
    },

    // 重叠判断
    overlay() {
        let collider1 = this.choice.getComponent(cc.PolygonCollider);
        let inChildren = false;
        let inChoice = false;
        for (var cc2 = 0; cc2 < collider1.world.points.length; cc2++) {
            collider1.world.points[cc2].x = Math.ceil(collider1.world.points[cc2].x);
            collider1.world.points[cc2].y = Math.ceil(collider1.world.points[cc2].y);
        }
        for (var b = 0; b < this.children.length; b++) {
            if (this.children[b].inCame == 1) {
                let childrenCollider = this.children[b].getComponent(cc.PolygonCollider);
                for (var cc1 = 0; cc1 < childrenCollider.world.points.length; cc1++) {
                    childrenCollider.world.points[cc1].x = Math.ceil(childrenCollider.world.points[cc1].x);
                    childrenCollider.world.points[cc1].y = Math.ceil(childrenCollider.world.points[cc1].y);
                }
                // 已放置图形是否有点在选中对象内部
                for (var d = 0; d < childrenCollider.world.points.length; d++) {
                    let childrenWorldPoint = childrenCollider.world.points[d];
                    if (this.pointInPolygon(childrenWorldPoint, collider1.world.points)) {
                        inChoice = true;
                        break;
                    }
                }
                // 选中对象是否有点在已放置图形内部
                for (var c = 0; c < collider1.world.points.length; c++) {
                    let colliderWorldPoint = collider1.world.points[c];
                    if (this.pointInPolygon(colliderWorldPoint, childrenCollider.world.points)) {
                        inChildren = true;
                        break;
                    };
                };
            }
            // 两者都没 放置
            if (b == this.children.length - 1 && inChildren == false && inChoice == false) {
                this.choice.inCame = 1;
                this.choice.prefabArea = this.polygonArea(collider1.world.points);
                break;
            };
            // 两者满足一点 返回
            if (inChildren == true || inChoice == true) {
                this.backPosition();
                break;
            };
        };
        this.choice = null;
        this.win();
    },

    // 点的最值
    top(point1, point2) {
        if (point1.y < point2.y) {
            return point2;
        } else {
            return point1;
        }
    },
    button(point1, point2) {
        if (point1.y > point2.y) {
            return point2;
        } else {
            return point1;
        }
    },
    left(point1, point2) {
        if (point1.x > point2.x) {
            return point2;
        } else {
            return point1;
        }
    },
    right(point1, point2) {
        if (point1.x < point2.x) {
            return point2;
        } else {
            return point1;
        }
    },

    // 重叠判断方法
    pointInPolygon(point, polygon) {
        var inside = false;
        var x = point.x;
        var y = point.y;
        var length = polygon.length;

        for (var i = 0, j = length - 1; i < length; j = i++) {
            var xi = polygon[i].x, yi = polygon[i].y,
                xj = polygon[j].x, yj = polygon[j].y;

            //是否在线段上
            if ((x - xi) * (yj - yi) == (xj - xi) * (y - yi) && Math.min(xi, xj) <= x && x <= Math.max(xi, xj) && Math.min(yi, yj) <= y && y <= Math.max(yi, yj)) {
                return false;
            }

            var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    },

    // 重新开始
    rePlay() {
        let children = this.node.children;
        for (var index = 0; index < children.length; index++) {
            if (children[index].name == 'DrawPrefab') {
                let object = children[index];
                object.position = object.selfPosition;
                object.scaleX = 0.25;
                object.scaleY = 0.25;
                object.zIndex = 0;
                object.inCame = 0;
                object.prefabArea = 0;
            }
        }
    }
});
