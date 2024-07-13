document.addEventListener("DOMContentLoaded", function() {
    var script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${CLIENT_ID}`;
    script.onload = function() {
        initMap();
    };
    document.head.appendChild(script);

    function initMap() {
        var map = new naver.maps.Map('map', {
            center: new naver.maps.LatLng(37.5665, 126.9780), // 초기 중심 좌표 (서울 시청)
            zoom: 15, // 초기 줌 레벨
            mapTypeControl: true
        });

        // 예제 데이터 (상호 및 위치)
        var markers = [
            {
                title: "더 건강한 피티",
                position: {lat: 37.5617, lng: 126.9825},
                description: "피트니스 센터",
                category: "피트니스 센터",
                image: "https://www.wayflorkorea.com/wp-content/uploads/2022/02/IMG_4911-768x512.jpg"
            },
            {
                title: "공덕 차이나",
                position: {lat: 37.5604, lng: 126.9723},
                description: "중식당",
                category: "중식당",
                image: "https://cdn.onews.tv/news/photo/202306/167892_203296_3858.jpg"
            },
            {
                title: "동촌 칼국수",
                position: {lat: 37.5635, lng: 126.9710},
                description: "칼국수 전문점",
                category: "칼국수 전문점",
                image: "https://img.smlounge.co.kr/upload/arena/article/202305/thumb/53610-514086-sample.jpg"
            }
        ];

        var markerList = [];
        var infoWindow = new naver.maps.InfoWindow({
            anchorSkew: true,
            backgroundColor: "#fff",
            borderColor: "#ccc",
            borderWidth: 1,
            disableAutoPan: true,
            pixelOffset: new naver.maps.Point(10, -10),
            zIndex: 100,
            anchorSize: new naver.maps.Size(10, 10),
            anchorColor: "#fff"
        });

        // 마커 생성 및 정보 윈도우 설정
        for (var i = 0, ii = markers.length; i < ii; i++) {
            var data = markers[i],
                position = new naver.maps.LatLng(data.position.lat, data.position.lng),
                marker = new naver.maps.Marker({
                    position: position,
                    map: map,
                    title: data.title,
                    icon: {
                        url: 'https://navermaps.github.io/maps.js/docs/img/example/pin_default.png',
                        size: new naver.maps.Size(24, 37),
                        anchor: new naver.maps.Point(12, 37)
                    }
                });

            markerList.push(marker);

            naver.maps.Event.addListener(marker, 'click', getClickHandler(i));
        }

        // 정보 윈도우 클릭 핸들러
        function getClickHandler(seq) {
            return function(e) {
                var marker = markerList[seq],
                    info = markers[seq];

                infoWindow.setContent('<div class="infoWindow">' +
                    '<img src="' + info.image + '" alt="' + info.title + '" style="width:100%;height:auto;">' +
                    '<h4>' + info.title + '</h4>' +
                    '<p>' + info.description + '</p>' +
                    '</div>');

                infoWindow.open(map, marker);
            };
        }

        naver.maps.Event.addListener(map, 'click', function(e) {
            infoWindow.close();
        });

        // 마커 클러스터링
        var markerClustering = new MarkerClustering({
            minClusterSize: 2,
            maxZoom: 17,
            map: map,
            markers: markerList,
            disableClickZoom: false,
            gridSize: 120,
            icons: [new naver.maps.Marker({
                content: '<div class="clusterMarker">CLUSTER_COUNT</div>'
            })],
            indexGenerator: [10, 100, 200, 500, 1000],
            stylingFunction: function(clusterMarker, count) {
                clusterMarker.getElement().innerHTML = count;
            }
        });

        // 카테고리 필터링
        function filterMarkers() {
            var selectedCategory = document.getElementById('category').value;

            for (var i = 0, ii = markers.length; i < ii; i++) {
                var marker = markerList[i];
                if (selectedCategory === 'all' || markers[i].category === selectedCategory) {
                    marker.setMap(map);
                } else {
                    marker.setMap(null);
                }
            }

            markerClustering.setMarkers(markerList.filter(marker => marker.getMap()));
        }

        document.getElementById('category').addEventListener('change', filterMarkers);
    }
});
