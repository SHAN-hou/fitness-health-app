package com.shanhou.fitnesshealthapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun HomeScreen() {
    val dateFormat = SimpleDateFormat("yyyy年MM月dd日 EEEE", Locale.CHINESE)
    val today = dateFormat.format(Date())
    
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
                        "你好，用户！",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(today, fontSize = 14.sp, color = Color.White.copy(alpha = 0.9f))
                }
            }
        }
        
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("今日概览", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        StatItem("0", "步数")
                        StatItem("0", "卡路里")
                        StatItem("0", "活动分钟")
                    }
                }
            }
        }
        
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("快速开始", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        QuickActionButton("🏃", "跑步")
                        QuickActionButton("🚴", "骑行")
                        QuickActionButton("🧘", "瑜伽")
                        QuickActionButton("💪", "力量")
                    }
                }
            }
        }
        
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("健康提醒", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    ReminderItem("💧", "记得喝水", "保持水分摄入，建议每小时喝一杯水")
                    Spacer(modifier = Modifier.height(8.dp))
                    ReminderItem("🚶", "起身活动", "久坐不利健康，每小时起身走动5分钟")
                }
            }
        }
    }
}

@Composable
private fun StatItem(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            value,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(label, fontSize = 14.sp, color = Color.Gray)
    }
}

@Composable
private fun QuickActionButton(emoji: String, label: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .background(
                MaterialTheme.colorScheme.primaryContainer,
                RoundedCornerShape(12.dp)
            )
            .padding(12.dp)
    ) {
        Text(emoji, fontSize = 32.sp)
        Spacer(modifier = Modifier.height(4.dp))
        Text(label, fontSize = 14.sp)
    }
}

@Composable
private fun ReminderItem(emoji: String, title: String, description: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(emoji, fontSize = 32.sp)
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Text(title, fontWeight = FontWeight.SemiBold)
            Text(description, fontSize = 14.sp, color = Color.Gray)
        }
    }
}
