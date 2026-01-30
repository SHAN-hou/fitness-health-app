package com.shanhou.fitnesshealthapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun StatsScreen() {
    val weeklyData = listOf(
        "周一" to 120,
        "周二" to 85,
        "周三" to 200,
        "周四" to 0,
        "周五" to 150,
        "周六" to 300,
        "周日" to 180
    )
    val maxCalories = weeklyData.maxOf { it.second }.coerceAtLeast(100)
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        "本周总结",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        WeeklyStat("5", "次运动")
                        WeeklyStat("120", "分钟")
                        WeeklyStat("1035", "卡路里")
                    }
                }
            }
        }
        
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("每日卡路里消耗", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(120.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        weeklyData.forEach { (day, calories) ->
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier.weight(1f)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .width(24.dp)
                                        .height((80 * calories / maxCalories).dp.coerceAtLeast(4.dp))
                                        .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                                        .background(MaterialTheme.colorScheme.primary)
                                )
                                Text(day, fontSize = 12.sp, color = Color.Gray)
                            }
                        }
                    }
                }
            }
        }
        
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("今日数据", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        TodayStat("👣", "6,500", "步数")
                        TodayStat("🔥", "280", "卡路里")
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        TodayStat("⏱️", "45", "活动分钟")
                        TodayStat("💧", "6", "杯水")
                    }
                }
            }
        }
        
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE3F2FD))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("💡 健康小贴士", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "• 每天保持30分钟以上的中等强度运动\n" +
                        "• 运动前后记得拉伸热身\n" +
                        "• 保持充足的睡眠（7-8小时）\n" +
                        "• 每天饮水量建议8杯以上",
                        lineHeight = 24.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun WeeklyStat(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color.White)
        Text(label, fontSize = 14.sp, color = Color.White.copy(alpha = 0.9f))
    }
}

@Composable
private fun TodayStat(emoji: String, value: String, label: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF9F9F9))
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(emoji, fontSize = 32.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Text(label, fontSize = 14.sp, color = Color.Gray)
        }
    }
}
